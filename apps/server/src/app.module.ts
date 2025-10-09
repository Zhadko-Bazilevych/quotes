import { Module } from '@nestjs/common';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/config.configuration';
import { AuthModule as NestjsBetterAuthModule } from '@thallesp/nestjs-better-auth';
import { AuthModule } from 'src/auth/auth.module';
import { AuthFactory } from 'src/auth/auth.provider';
import { QuoteModule } from 'src/quote/quote.module';

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
    AuthModule,
    NestjsBetterAuthModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthFactory],
      useFactory: (factory: AuthFactory) => ({
        auth: factory.client,
        isGlobal: true,
        disableGlobalAuthGuard: true,
      }),
    }),
    QuoteModule,
  ],
})
export class AppModule {}
