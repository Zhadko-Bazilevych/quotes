import z from 'zod';

export const updateQuoteSchema = z.object({
  author: z.string().min(3).max(30).optional(),
  userId: z.number().optional(),
  content: z.string().min(3).max(500).optional(),
  context: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

export type QuoteSchema = z.infer<typeof updateQuoteSchema>;
