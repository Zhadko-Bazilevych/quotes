import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MigratorService } from './database/migrator/migrator.service';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true }),
    bufferLogs: true,
    cors: {
      origin: ['https://thatonequotes.duckdns.org', 'http://localhost:5173'],
    },
  });
  app.set('query parser', 'extended');

  const migratorService = app.get(MigratorService);
  await migratorService.migrate();

  await app.listen(3000);
}

void bootstrap();
