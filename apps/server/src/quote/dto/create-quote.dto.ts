import { visibilitySchema } from 'src/quote/dto/visibility.dto';
import z from 'zod';

export const createQuoteSchema = z.object({
  author: z.string().trim().min(3).max(30),
  content: z.string().trim().min(3).max(500),
  context: z.string().trim().max(500),
  visibility: visibilitySchema,
});

export type CreateQuoteDto = z.infer<typeof createQuoteSchema>;
