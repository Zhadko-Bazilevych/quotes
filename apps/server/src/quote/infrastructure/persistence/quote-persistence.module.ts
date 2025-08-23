import { Module } from '@nestjs/common';
import { KyselyQuoteRepository } from './repositiries/quote.repository';
import { QuoteRepository } from './repositiries/quote-repository.interface';
import { KyselyModule } from 'src/database/kysely.module';

@Module({
  imports: [KyselyModule],
  providers: [
    {
      provide: QuoteRepository,
      useClass: KyselyQuoteRepository,
    },
  ],
  exports: [QuoteRepository],
})
export class QuotePersistenceModule {}
