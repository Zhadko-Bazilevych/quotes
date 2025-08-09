import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MigratorService } from './database/migrator/migrator.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true }),
    bufferLogs: true,
    cors: true,
  });

  const migratorService = app.get(MigratorService);
  await migratorService.migrate();

  await app.listen(3000);
}

void bootstrap();
