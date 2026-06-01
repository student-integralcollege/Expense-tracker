import { z } from "zod";

const authBody = z.object({
  name: z.string().min(2).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const signupSchema = z.object({
  body: authBody.extend({
    name: z.string().min(2).max(60),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: authBody.pick({
    email: true,
    password: true,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(60),
    email: z.string().email(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
