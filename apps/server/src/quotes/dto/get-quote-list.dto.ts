import { INT_MAX } from 'src/utils/constants';
import z from 'zod';

export const getQuoteListSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(INT_MAX).default(1),
    size: z.coerce.number().int().min(1).max(100).default(30),
  })
  .strict();

export type GetQuoteListSchema = z.infer<typeof getQuoteListSchema>;
