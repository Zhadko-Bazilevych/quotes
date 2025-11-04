import { PAGINATION } from '@/utils/constants';
import z from 'zod';

export const sortFields = [
  'author',
  'user.name',
  'createdAt',
  'updatedAt',
] as const;
export type SortField = (typeof sortFields)[number];

export const sortOrders = ['asc', 'desc'] as const;
export type SortOrder = (typeof sortOrders)[number];

const sortOptionSchema = z.object({
  field: z.literal(sortFields),
  order: z.literal(sortOrders),
});

export type SortOption = z.infer<typeof sortOptionSchema>;

export const quoteListQuerySchema = z.object({
  page: z.int32().positive().catch(1),
  pageSize: z.int32().positive().catch(PAGINATION.DEFAULT_PAGE_SIZE),
  q: z.string().optional().catch(''),
  sort: sortOptionSchema
    .array()
    .max(sortFields.length)
    .transform((sortOptionsInput) => {
      const deduplicatedSortOptions: SortOption[] = [];

      for (let i = 0; i < sortOptionsInput.length; i++) {
        const sortOption = sortOptionsInput[i];
        const duplicateSortOption = deduplicatedSortOptions.find(
          (dso) => dso.field === sortOption.field,
        );

        if (!duplicateSortOption) {
          deduplicatedSortOptions.push(sortOption);
        }
      }

      return deduplicatedSortOptions;
    })
    .catch([]),
});
