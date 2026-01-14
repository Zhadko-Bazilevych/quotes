import {
  UserListQueryDto,
  userListQuerySchema,
} from 'src/user/dto/user-list-query.dto';
import { UserService } from 'src/user/user.service';
import { UserList } from 'src/user/user.types';
import { matchError } from 'src/utils/errors/match-error';
import { UnexpectedException } from 'src/utils/exceptions';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';

import { Body, Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getList(
    @Query(new ZodValidationPipe(userListQuerySchema))
    searchOptions: UserListQueryDto,
  ): Promise<UserList> {
    return this.userService.getList(searchOptions).match(
      (users) => users,
      (err) =>
        matchError(err, {
          UnexpectedError: () => new UnexpectedException(),
        }),
    );
  }
}
