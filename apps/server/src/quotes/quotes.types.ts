import z from 'zod';

export type Quote = {
  id: number;
  author: string;
  content: string;
  user: string;
  context: string;
  created_at: Date;
  updated_at: Date;
};

export const getQuoteByIdSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .required();

export type getQuoteByIdDto = z.infer<typeof getQuoteByIdSchema>;

export const createQuoteSchema = z
  .object({
    author: z.string(),
    content: z.string(),
    user: z.string(),
    context: z.string(),
  })
  .required();

export type CreateQuoteDto = z.infer<typeof createQuoteSchema>;
