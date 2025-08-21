import { PAGINATION_PAGE_SIZE } from '@/utils/constrants';
import z from 'zod';

export const quoteListSearchSchema = z.object({
  page: z.int32().positive().catch(1),
  size: z.int32().positive().catch(PAGINATION_PAGE_SIZE),
});
