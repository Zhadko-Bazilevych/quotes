import type { Quote, QuoteDto } from '@/types/quote';

export class QuoteMapper {
  static toDomain(dto: QuoteDto): Quote {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }
}
