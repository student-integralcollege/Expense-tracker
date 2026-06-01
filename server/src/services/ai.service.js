import { Groq } from "groq-sdk";
import { env } from "../config/env.js";
import { buildFallbackInsights } from "../utils/insights.js";

const hasGroqKey = Boolean(env.GROQ_API_KEY?.trim());
const groqClient = hasGroqKey
  ? new Groq({
      apiKey: env.GROQ_API_KEY,
    })
  : null;
const activeProvider = groqClient ? "groq" : null;
const activeModel = env.GROQ_MODEL;
const activeEndpoint = "https://api.groq.com/openai/v1";

const addMeta = (insights, meta) => ({
  ...insights,
  _meta: {
    provider: activeProvider || "none",
    model: activeModel,
    endpoint: activeEndpoint,
    ...meta,
  },
});

const normalizeInsights = (parsed) => {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI response was empty or not a JSON object");
  }

  return {
    overview: typeof parsed.overview === "string" && parsed.overview.trim()
      ? parsed.overview.trim()
      : "No overview was returned by the AI model.",
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : [],
    warnings: Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : [],
  };
};

const getErrorDetails = (error) => {
  if (error?.status === 401) {
    return { type: "auth", message: "AI authentication failed. Check GROQ_API_KEY." };
  }

  if (error?.status === 429) {
    return { type: "rate_limit", message: "AI rate limit reached. Try again later." };
  }

  if (error?.name === "APIConnectionTimeoutError" || error?.code === "ETIMEDOUT") {
    return { type: "timeout", message: "AI request timed out." };
  }

  return {
    type: error?.status ? `api_${error.status}` : "unknown",
    message: error?.message || "AI request failed.",
  };
};

export const generateInsights = async ({ expenses, summary, budgets }) => {
  const requestId = `ai-${Date.now()}`;

  if (!activeProvider) {
    console.warn(`[AI] ${requestId} skipped: no AI API key is configured`);
    return addMeta(buildFallbackInsights({ expenses, summary, budgets }), {
      requestId,
      source: "fallback",
      fallbackReason: "missing_api_key",
    });
  }

  try {
    const prompt = `
You are a helpful financial coach. Analyze the provided JSON data and return valid JSON with:
- overview: short paragraph
- recommendations: array of 3 concise actionable strings
- warnings: array of important risk strings

Data:
${JSON.stringify({ expenses, summary, budgets })}
    `;

    console.info(`[AI] ${requestId} sending request`, {
      provider: activeProvider,
      model: activeModel,
      endpoint: activeEndpoint,
      transactionCount: expenses.length,
      budgetCount: budgets.length,
      timeoutMs: env.AI_REQUEST_TIMEOUT_MS,
    });

    const completion = await groqClient.chat.completions.create({
      model: activeModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You generate concise financial insights for an expense tracker. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_completion_tokens: 1024,
    }, {
      timeout: env.AI_REQUEST_TIMEOUT_MS,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("AI returned an empty message");
    }

    console.info(`[AI] ${requestId} response received`, {
      completionId: completion.id,
      finishReason: completion.choices[0]?.finish_reason,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    });

    const parsed = normalizeInsights(JSON.parse(raw));
    console.info(`[AI] ${requestId} parsed output`, {
      recommendationCount: parsed.recommendations.length,
      warningCount: parsed.warnings.length,
    });

    return addMeta(parsed, {
      requestId,
      source: "ai",
      completionId: completion.id,
      finishReason: completion.choices[0]?.finish_reason,
      usage: completion.usage,
    });
  } catch (error) {
    const details = getErrorDetails(error);
    console.error(`[AI] ${requestId} failed`, {
      type: details.type,
      message: details.message,
      status: error?.status,
      code: error?.code,
    });

    return addMeta(buildFallbackInsights({ expenses, summary, budgets }), {
      requestId,
      source: "fallback",
      fallbackReason: details.type,
      errorMessage: details.message,
    });
  }
};
