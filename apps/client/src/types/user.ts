import z from 'zod';

export type UserSearchItem = {
  id: number;
  name: string;
};

export type UserList = UserSearchItem[];

export const getUsersQuerySchema = z.object({
  q: z.string().optional().catch(''),
  limit: z.int32().positive(),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
