import type { ResultAsync } from 'neverthrow';
import { type UserListQueryDto } from 'src/user/dto/user-list-query.dto';
import { type UserList } from 'src/user/user.types';
import { type UnexpectedError } from 'src/utils/errors/app-errors';

export abstract class UserRepository {
  abstract getList(
    options: UserListQueryDto,
  ): ResultAsync<UserList, UnexpectedError>;
}
