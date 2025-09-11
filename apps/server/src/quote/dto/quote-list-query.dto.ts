import { buildSortSchema } from 'src/utils/dto/build-sort-schema';
import { paginationSchema } from 'src/utils/dto/pagination.dto';
import z from 'zod';

const quoteListFilterSchema = z
  .object({
    q: z.string().max(100).optional(),
  })
  .optional();

export type QuoteListFilterDto = z.infer<typeof quoteListFilterSchema>;

const quoteListSortSchema = buildSortSchema([
  'author',
  'user',
  'createdAt',
  'updatedAt',
]);

export const quoteListQuerySchema = z.object({
  pagination: paginationSchema,
  filter: quoteListFilterSchema,
  sort: quoteListSortSchema,
});

export type QuoteListSortDto = z.infer<typeof quoteListSortSchema>;
export type QuoteListQueryDto = z.infer<typeof quoteListQuerySchema>;
