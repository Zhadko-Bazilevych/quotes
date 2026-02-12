import z from 'zod';

export const createQuoteSchema = z.object({
  author: z.string().min(3).max(30),
  content: z.string().min(3).max(500),
  context: z.string().max(500),
  visibility: z.enum(['public', 'private']),
});

export type QuoteSchema = z.infer<typeof createQuoteSchema>;
