import { appConfig } from 'src/config/app.config';
import { authConfig } from 'src/config/auth.config';
import { dbConfig } from 'src/config/db.config';
import { KyselyModule } from 'src/database/kysely.module';
import { SeederService } from 'src/database/seeder/seeder.service';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    KyselyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig, authConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
  ],
  providers: [SeederService],
})
export class SeederModule {}
