import { SeederModule } from 'src/database/seeder/seeder.module';
import { SeederService } from 'src/database/seeder/seeder.service';

import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
  try {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const seeder = appContext.get(SeederService);
    await seeder.seed();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

void bootstrap();
