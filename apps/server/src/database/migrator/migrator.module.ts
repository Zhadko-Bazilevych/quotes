import { Module } from '@nestjs/common';
import { MigratorService } from './migrator.service';
import { KyselyModule } from 'src/database/kysely.module';

@Module({
  imports: [KyselyModule],
  providers: [MigratorService],
  exports: [MigratorService],
})
export class MigratorModule {}
