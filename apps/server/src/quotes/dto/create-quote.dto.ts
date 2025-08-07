import z from 'zod';

// TODO: validate min and max length
export const createQuoteSchema = z
  .object({
    author: z.string().trim().min(1),
    content: z.string().trim().min(1),
    user: z.string().trim().min(1),
    context: z.string().trim(),
  })
  .strict();

export type CreateQuoteDto = z.infer<typeof createQuoteSchema>;
