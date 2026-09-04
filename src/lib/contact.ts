import { z } from "zod";

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(180),
  mobile: z.string().trim().min(6).max(40),
  website: z.string().max(0).optional().default(""),
  message: z.string().trim().min(10).max(4000),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
