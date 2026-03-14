import { UserPersistenceModule } from 'src/user/infrastructure/persistence/user-persistence.module';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
