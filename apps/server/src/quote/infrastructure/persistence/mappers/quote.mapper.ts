import type { Quote } from 'src/quote/domain/quote';
import type { QuoteAggregate } from 'src/quote/domain/quote-aggregate';
import type { QuoteAggregateEntity as QuoteAggregateEntity } from 'src/quote/infrastructure/persistence/entities/quote-read.entity';

import type { QuoteEntity } from '../entities/quote.entity';

export class QuoteMapper {
  static entityToDomain(raw: QuoteEntity): Quote {
    return {
      id: raw.id,
      userId: raw.userId,
      author: raw.author,
      content: raw.content,
      context: raw.context,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static entityAggregateToDomain(raw: QuoteAggregateEntity): QuoteAggregate {
    return {
      id: raw.id,
      userId: raw.userId,
      user: {
        id: raw.userId,
        name: raw.name,
      },
      author: raw.author,
      content: raw.content,
      context: raw.context,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
