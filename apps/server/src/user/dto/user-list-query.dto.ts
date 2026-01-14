import z from 'zod';

export const userListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100),
});

export type UserListQueryDto = z.infer<typeof userListQuerySchema>;
