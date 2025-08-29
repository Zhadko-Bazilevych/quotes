import { PAGINATION } from '@/utils/constants';
import z from 'zod';

export const quoteListQuerySchema = z.object({
  page: z.int32().positive().catch(1),
  pageSize: z.int32().positive().catch(PAGINATION.DEFAULT_PAGE_SIZE),
  q: z.string().optional(),
  sort: z
    .literal([
      'author',
      'user',
      'createdAt',
      'updatedAt',
      '-author',
      '-user',
      '-createdAt',
      '-updatedAt',
    ])
    .array()
    .transform((sort) => [...new Set(sort)])
    .catch(['-createdAt']),
});

export type QuoteListSearchDto = z.infer<typeof quoteListQuerySchema>;
