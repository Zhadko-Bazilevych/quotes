import z from 'zod';

export const createQuoteSchema = z.object({
  author: z.string().trim().min(3).max(30),
  content: z.string().trim().min(3).max(500),
  user: z.string().trim().min(3).max(30),
  context: z.string().trim().max(500),
  visibility: z.enum(['public', 'private']).default('private'),
});

export type CreateQuoteDto = z.infer<typeof createQuoteSchema>;
