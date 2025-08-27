import z from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).pipe(z.int32()).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
