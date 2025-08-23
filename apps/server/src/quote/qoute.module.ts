import { Module } from '@nestjs/common';
import { QuoteController } from 'src/quote/quote.controller';
import { QuoteService } from 'src/quote/quote.service';
import { QuotePersistenceModule } from './infrastructure/persistence/quote-persistence.module';

@Module({
  imports: [QuotePersistenceModule],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
