import { KyselyUserRepository } from 'src/user/infrastructure/persistence/repositiries/user.repository';
import { UserRepository } from 'src/user/infrastructure/persistence/repositiries/user-repository.interface';

import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: KyselyUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserPersistenceModule {}
