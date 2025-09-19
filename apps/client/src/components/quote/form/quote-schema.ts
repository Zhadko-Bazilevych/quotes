import z from 'zod';

export const quoteSchema = z.object({
  author: z.string().min(3).max(30),
  content: z.string().min(3).max(500),
  context: z.string().max(500),
  user: z.string().min(3).max(30),
});

export type QuoteSchema = z.infer<typeof quoteSchema>;
