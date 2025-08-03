import { Module } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';

@Module({
  providers: [KyselyService],
  exports: [KyselyService],
})
export class KyselyModule {}
