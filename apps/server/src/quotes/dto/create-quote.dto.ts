import z from 'zod';

// TODO: validate min and max length
export const createQuoteSchema = z
  .object({
    author: z.string(),
    content: z.string(),
    user: z.string(),
    context: z.string(),
  })
  .strict();

export type CreateQuoteDto = z.infer<typeof createQuoteSchema>;
