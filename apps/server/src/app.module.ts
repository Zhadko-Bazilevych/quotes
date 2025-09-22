import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuoteModule } from './quote/qoute.module';
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
    QuoteModule,
  ],
})
export class AppModule {}
