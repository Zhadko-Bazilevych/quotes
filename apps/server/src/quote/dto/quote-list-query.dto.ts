import { paginationSchema } from 'src/utils/dto/pagination.dto';
import z from 'zod';

const quoteListFilterSchema = z
  .object({
    q: z.string().max(100).optional(),
  })
  .optional();

export type QuoteListFilterDto = z.infer<typeof quoteListFilterSchema>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function buildSortSchema<const T extends ReadonlyArray<string>>(fields: T) {
  const fieldsWithMinus: Array<T[number] | `-${T[number]}`> = fields.concat(
    fields.map((field) => `-${field}`),
  );

  return z
    .string()
    .transform((s) => s.split(','))
    .pipe(
      z
        .literal(fieldsWithMinus)
        .transform((f) => {
          const startsWithMinus = f.startsWith('-');
          const order = startsWithMinus ? ('desc' as const) : ('asc' as const);
          const field = startsWithMinus
            ? (f.slice(1) as T[number])
            : (f as T[number]);

          return {
            field,
            order,
          };
        })
        .array(),
    )
    .optional();
}

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
