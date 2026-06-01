import { z } from "zod";

const expenseBody = z.object({
  title: z.string().min(2).max(120),
  amount: z.coerce.number().positive(),
  category: z.string().min(2).max(60),
  type: z.enum(["expense", "income"]).default("expense"),
  paymentMethod: z.string().min(2).max(40).default("Card"),
  notes: z.string().max(300).optional().default(""),
  tags: z.array(z.string().min(1).max(30)).optional().default([]),
  date: z.coerce.date(),
});

export const createExpenseSchema = z.object({
  body: expenseBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateExpenseSchema = z.object({
  body: expenseBody,
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const expenseQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    category: z.string().optional(),
    type: z.enum(["expense", "income"]).optional(),
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    search: z.string().optional(),
  }),
});
