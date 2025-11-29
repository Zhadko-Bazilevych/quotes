import { bodyParserMiddleware } from 'src/auth/auth.middleware';
import type { Config } from 'src/config/config.types';

import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { MigratorService } from './database/migrator/migrator.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true }),
    bufferLogs: true,
    bodyParser: false,
  });
  app.set('query parser', 'extended');

  app.use(bodyParserMiddleware);

  const config = app.get(ConfigService<Config, true>);
  const cors = config.get('app.cors', { infer: true });
  app.enableCors({ origin: cors, credentials: true });

  const migratorService = app.get(MigratorService);
  await migratorService.migrate();

  await app.listen(3000);
}

void bootstrap();
