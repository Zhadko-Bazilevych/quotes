export type UserSearchItem = {
  id: number;
  name: string;
};

export type UserList = UserSearchItem[];

export type GetUsersQuery = {
  limit: number;
  q?: string;
};
