import { appConfig } from 'src/config/app.config';
import { authConfig } from 'src/config/auth.config';
import { dbConfig } from 'src/config/db.config';
import { KyselyModule } from 'src/database/kysely.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, appConfig, authConfig],
      envFilePath: ['.env'],
    }),
    KyselyModule,
  ],
})
export class DbContextModule {}
