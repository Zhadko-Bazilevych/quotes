import { paginationSchema } from 'src/utils/dto/pagination.dto';
import z from 'zod';

const quoteListFilterSchema = z
  .object({
    q: z.string().max(100).optional(),
  })
  .optional();

export type QuoteListFilterDto = z.infer<typeof quoteListFilterSchema>;

export const quoteListQuerySchema = z.object({
  pagination: paginationSchema,
  filter: quoteListFilterSchema,
});

export type QuoteListQueryDto = z.infer<typeof quoteListQuerySchema>;
