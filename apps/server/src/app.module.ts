import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuoteModule } from './quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/config.configuration';
import { HealthcheckModule } from 'src/healthcheck/healthcheck.module';

@Module({
  imports: [
    KyselyModule,
    MigratorModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
    QuoteModule,
    HealthcheckModule,
  ],
})
export class AppModule {}
