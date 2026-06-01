import { z } from "zod";

export const insightsSchema = z.object({
  body: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  }).optional().default({}),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
