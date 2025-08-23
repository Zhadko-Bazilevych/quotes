import type { Quote } from 'src/quote/domain/quote';
import type { QuoteEntity } from '../entities/quote.entity';

export class QuoteMapper {
  static toDomain(raw: QuoteEntity): Quote {
    return {
      id: raw.id,
      user: raw.user,
      author: raw.author,
      content: raw.content,
      context: raw.context,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
