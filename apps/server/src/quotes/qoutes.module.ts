import { Module } from '@nestjs/common';
import { QuotesController } from 'src/quotes/quotes.controller';
import { QuotesService } from 'src/quotes/quotes.service';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';

@Module({
  imports: [KyselyModule, MigratorModule],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
