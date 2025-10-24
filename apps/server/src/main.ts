import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MigratorService } from './database/migrator/migrator.service';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true }),
    bufferLogs: true,
    bodyParser: false,
  });
  app.set('query parser', 'extended');

  const config = app.get(ConfigService);
  const clientUrl = config.get<string>('client.url');
  if (clientUrl) {
    app.enableCors({ origin: [clientUrl] });
  }

  const migratorService = app.get(MigratorService);
  await migratorService.migrate();

  await app.listen(3000);
}

void bootstrap();
