import z from 'zod';

export const updateQuoteSchema = z.object({
  author: z.string().trim().min(3).max(30).optional(),
  content: z.string().trim().min(3).max(500).optional(),
  user: z.string().trim().min(3).max(30).optional(),
  context: z.string().trim().max(500).optional(),
});

export type UpdateQuoteDto = z.infer<typeof updateQuoteSchema>;
