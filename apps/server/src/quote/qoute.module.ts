import { Module } from '@nestjs/common';
import { QuotesController } from 'src/quote/quote.controller';
import { QuotesService } from 'src/quote/quote.service';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';

@Module({
  imports: [KyselyModule, MigratorModule],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
