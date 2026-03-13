import z from 'zod';

export const updateQuoteSchema = z.object({
  author: z.string().min(3).max(30),
  userId: z.number().optional(),
  content: z.string().min(3).max(500),
  context: z.string().max(500),
  visibility: z.enum(['public', 'private']),
});

export type UpdateQuoteSchema = z.infer<typeof updateQuoteSchema>;
