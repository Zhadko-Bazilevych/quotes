import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuoteModule } from './quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/config.configuration';
import { HealthModule } from 'src/health/health.module';

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
    HealthModule,
  ],
})
export class AppModule {}
