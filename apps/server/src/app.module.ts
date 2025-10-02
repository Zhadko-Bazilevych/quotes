import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuoteModule } from './quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/config.configuration';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AuthConfigModule } from 'src/auth/auth.config.module';
import { AuthFactory } from 'src/auth/auth.provider';

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
    AuthConfigModule,
    AuthModule.forRoot({
      auth: AuthFactory.getAuth(),
      isGlobal: true,
    }),
    QuoteModule,
  ],
})
export class AppModule {}
