import React from "react";
import { Brain, RefreshCw, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

export function InsightsPanel({ insights, loading, onRefresh, isDemoMode }) {
  const demoInsights = {
    overview: "Your monthly savings rate is outstanding at 81%! You spent $9,595 on Food this month, which represents 100% of your total expenditures. To maintain a healthy financial cushion, consider keeping food costs below $10,000 monthly.",
    recommendations: [
      "Keep food spending steady to stay under the $10,000 limit.",
      "Consider allocating a portion of your $40,405 savings into low-risk index funds or high-yield savings accounts.",
      "Review utility subscriptions to identify additional recurring expense cuts."
    ],
    warnings: [
      "Concentration risk: 100% of your expenses were in the Food category. Try adding other categories to diversify tracking.",
    ]
  };
  const displayInsights = insights || (isDemoMode ? demoInsights : null);
  const source = displayInsights?._meta?.source;
  const fallbackReason = displayInsights?._meta?.fallbackReason;
  const sourceLabel = isDemoMode
    ? "Demo"
    : source === "ai"
      ? "Live AI"
      : source === "fallback"
        ? "Fallback"
        : "Not loaded";

  return (
    <section className="bg-white rounded-[16px] border border-slate-100 p-6 md:p-8 shadow-premium hover:shadow-premium-hover transition-premium">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full text-xs font-semibold">
              <Brain size={14} />
              <span>AI Coach</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              source === "ai"
                ? "text-emerald-700 bg-emerald-50"
                : source === "fallback"
                  ? "text-orange-700 bg-orange-50"
                  : "text-slate-600 bg-slate-100"
            }`}>
              {sourceLabel}
            </span>
          </div>
          <h2 className="text-xl font-bold font-outfit text-slate-800 mt-2">
            Smart Financial Insights
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Actionable summaries, risk signals, and recommendations powered by AI models.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 active:scale-95 transition-premium shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Analyzing..." : "Refresh Insights"}</span>
        </button>
      </div>

      {!displayInsights && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm font-medium text-slate-500">
          Insights are not loaded yet. Refresh to run the AI analysis.
        </div>
      )}

      {fallbackReason && (
        <div className="mb-5 rounded-xl border border-orange-100 bg-orange-50 p-4 text-xs font-semibold text-orange-700">
          AI fallback is active: {displayInsights._meta.errorMessage || fallbackReason}.
        </div>
      )}

      {displayInsights && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overview Box */}
        <article className="p-5 rounded-2xl bg-teal-50/30 border border-teal-100/50 hover:bg-teal-50/50 transition-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-3">
              <TrendingUp size={16} />
              <span>Overview</span>
            </div>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              {displayInsights.overview}
            </p>
          </div>
        </article>

        {/* Recommendations Box */}
        <article className="p-5 rounded-2xl bg-blue-50/30 border border-blue-100/50 hover:bg-blue-50/50 transition-premium">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-3">
            <Lightbulb size={16} />
            <span>Recommendations</span>
          </div>
          <ul className="space-y-2.5 text-slate-600 text-xs md:text-sm list-disc pl-4 leading-relaxed">
            {displayInsights.recommendations?.map((item, idx) => (
              <li key={idx} className="marker:text-blue-500">
                {item}
              </li>
            ))}
          </ul>
        </article>

        {/* Warnings Box */}
        <article className="p-5 rounded-2xl bg-orange-50/30 border border-orange-100/50 hover:bg-orange-50/50 transition-premium">
          <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-3">
            <AlertTriangle size={16} />
            <span>Warnings</span>
          </div>
          <ul className="space-y-2.5 text-slate-600 text-xs md:text-sm list-disc pl-4 leading-relaxed">
            {(displayInsights.warnings?.length ? displayInsights.warnings : ["No major warnings this month."]).map((item, idx) => (
              <li key={idx} className="marker:text-orange-500">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
      )}
    </section>
  );
}
