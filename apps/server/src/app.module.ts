import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuotesModule } from './quotes/qoutes.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/config.configuration';

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
    QuotesModule,
  ],
})
export class AppModule {}
