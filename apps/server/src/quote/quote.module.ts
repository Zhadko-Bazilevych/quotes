import {
  QUOTE_SEARCH_QUERY_KEYWORDS,
  QUOTE_SEARCH_QUERY_SERVICE,
} from 'src/quote/quote.constants';
import { QuoteController } from 'src/quote/quote.controller';
import { QuoteService } from 'src/quote/quote.service';
import { SearchQueryModule } from 'src/search-query/search-query.module';

import { Module } from '@nestjs/common';

import { QuotePersistenceModule } from './infrastructure/persistence/quote-persistence.module';

@Module({
  imports: [
    QuotePersistenceModule,
    SearchQueryModule.register(
      QUOTE_SEARCH_QUERY_SERVICE,
      QUOTE_SEARCH_QUERY_KEYWORDS,
    ),
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
