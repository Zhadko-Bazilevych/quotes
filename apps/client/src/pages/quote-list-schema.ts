import { PAGINATION } from '@/utils/constants';
import z from 'zod';

export const quoteListQuerySchema = z.object({
  page: z.int32().positive().catch(1),
  pageSize: z.int32().positive().catch(PAGINATION.DEFAULT_PAGE_SIZE),
});
