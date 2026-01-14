import { ResultAsync } from 'neverthrow';
import { AuthStore } from 'src/auth/auth-als.module';
import { kyselyWhere } from 'src/auth/permissions';
import { KyselyService } from 'src/database/kysely.service';
import { UserListQueryDto } from 'src/user/dto/user-list-query.dto';
import { UserRepository } from 'src/user/infrastructure/persistence/repositiries/user-repository.interface';
import { UserList } from 'src/user/user.types';
import { dbTry } from 'src/utils/db';
import { UnexpectedError } from 'src/utils/errors/app-errors';

import { Injectable } from '@nestjs/common';

@Injectable()
export class KyselyUserRepository implements UserRepository {
  constructor(
    private readonly db: KyselyService,
    private readonly authStore: AuthStore,
  ) {}

  getList(options: UserListQueryDto): ResultAsync<UserList, UnexpectedError> {
    const { q, limit } = options;

    return this.db.withTransaction(() => {
      let baseQuery = this.db.ctx
        .selectFrom('user')
        .where('name', 'like', `%${q}%`);

      const { ability } = this.authStore.getStore();
      const conditions = kyselyWhere(ability, 'read', 'User');
      baseQuery = baseQuery.where(conditions);

      return dbTry(
        baseQuery.select(['user.id', 'name']).limit(limit).execute(),
      );
    });
  }
}
