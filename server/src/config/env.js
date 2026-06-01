import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  JWT_SECRET: z.string().min(10, "JWT_SECRET is required"),
});

export const env = envSchema.parse(process.env);
