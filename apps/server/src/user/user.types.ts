import { type UserId } from 'src/database/tables/user.tables';

export type UserSearchItem = {
  id: UserId;
  name: string;
};

export type UserList = UserSearchItem[];
