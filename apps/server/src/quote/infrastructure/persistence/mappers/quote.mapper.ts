import type { Quote } from 'src/quote/domain/quote';
import type { QuoteEntity } from '../entities/quote.entity';
import type { QuoteReadEntity } from 'src/quote/infrastructure/persistence/entities/quote-read.entity';
import type { QuoteRead } from 'src/quote/domain/quote-read';

export class QuoteMapper {
  static EntityToDomain(raw: QuoteEntity): Quote {
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

  static EntityReadToDomain(raw: QuoteReadEntity): QuoteRead {
    return {
      id: raw.id,
      userId: raw.userId,
      user: raw.name,
      author: raw.author,
      content: raw.content,
      context: raw.context,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
