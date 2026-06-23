import { appConfig } from 'src/config/app.config';
import { authConfig } from 'src/config/auth.config';
import { dbConfig } from 'src/config/db.config';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { Seeder } from 'src/database/seeder/seeder.provider';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    KyselyModule,
    MigratorModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig, authConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
  ],
  providers: [Seeder],
})
export class SeederModule {}
