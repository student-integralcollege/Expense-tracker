import { z } from "zod";

const budgetBody = z.object({
  category: z.string().min(2).max(60),
  limit: z.coerce.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

export const createBudgetSchema = z.object({
  body: budgetBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateBudgetSchema = z.object({
  body: budgetBody,
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
