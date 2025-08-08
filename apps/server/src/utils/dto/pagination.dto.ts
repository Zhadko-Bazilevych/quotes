import { INT_MAX } from 'src/utils/constants';
import z from 'zod';

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(INT_MAX).default(1),
    size: z.coerce.number().int().min(1).max(100).default(30),
  })
  .strict();

export type PaginationOptions = z.infer<typeof paginationSchema>;
