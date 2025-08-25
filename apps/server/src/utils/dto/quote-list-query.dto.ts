import z from 'zod';

export const quoteListQuerySchema = z.object({
  pagination: z
    .object({
      page: z.coerce.number().int().min(1).pipe(z.int32()).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(30),
    })
    .default({ page: 1, pageSize: 30 }),
  filter: z
    .object({
      search: z.string().max(100).default(''),
    })
    .default({ search: '' }),
});

export type QuoteListQueryDto = z.infer<typeof quoteListQuerySchema>;

export type QuoteListPaginationDto = {
  page: number;
  pageSize: number;
};
