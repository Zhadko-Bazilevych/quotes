import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/db.config';
import { AuthModule } from 'src/auth/auth.module';
import { QuoteModule } from 'src/quote/quote.module';
import { clientConfig } from 'src/config/client.config';

@Module({
  imports: [
    KyselyModule,
    MigratorModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, clientConfig],
      envFilePath: ['.env'],
      cache: true,
    }),
    AuthModule.register(),
    QuoteModule,
  ],
})
export class AppModule {}
