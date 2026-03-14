import { ResultAsync } from 'neverthrow';
import { UserListQueryDto } from 'src/user/dto/user-list-query.dto';
import { UserList } from 'src/user/user.types';
import { UnexpectedError } from 'src/utils/errors/app-errors';

import { Injectable } from '@nestjs/common';

import { UserRepository } from './infrastructure/persistence/repositiries/user-repository.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getList(
    userListQueryDto: UserListQueryDto,
  ): ResultAsync<UserList, UnexpectedError> {
    return this.userRepository.getList(userListQueryDto);
  }
}
