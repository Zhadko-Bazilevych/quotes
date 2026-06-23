import { SeederModule } from 'src/database/seeder/seeder.module';
import { Seeder } from 'src/database/seeder/seeder.provider';

import { NestFactory } from '@nestjs/core';

function bootstrap(): void {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);
      seeder.seed();
    })
    .catch((error: unknown) => {
      console.log(error);
      process.exit(1);
    });
}

bootstrap();
