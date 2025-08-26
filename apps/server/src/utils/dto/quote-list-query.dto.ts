import z from 'zod';

const quotePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).pipe(z.int32()).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
});

const quoteFilterSchema = z
  .object({
    q: z.string().max(100).optional(),
  })
  .optional();

export type QuotePaginationDto = z.infer<typeof quotePaginationSchema>;
export type QuoteFilterDto = z.infer<typeof quoteFilterSchema>;

export const quoteListQuerySchema = z.object({
  pagination: quotePaginationSchema,
  filter: quoteFilterSchema,
});

export type QuoteListQueryDto = z.infer<typeof quoteListQuerySchema>;

export type QuoteListPaginationDto = {
  page: number;
  pageSize: number;
};
