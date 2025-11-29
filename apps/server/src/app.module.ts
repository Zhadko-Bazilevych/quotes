import { AuthModule } from 'src/auth/auth.module';
import { appConfig } from 'src/config/app.config';
import { authConfig } from 'src/config/auth.config';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuoteModule } from 'src/quote/quote.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { dbConfig } from './config/db.config';

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
    AuthModule.register(),
    QuoteModule,
  ],
})
export class AppModule {}
