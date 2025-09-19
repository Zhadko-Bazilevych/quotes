import { Injectable } from '@nestjs/common';
import {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteId,
  QuoteList,
  UpdateQuoteError,
} from 'src/quote/quote.types';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { ResultAsync } from 'neverthrow';
import { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import { Quote } from './domain/quote';
import {
  QuoteListFilter,
  QuoteRepository,
} from './infrastructure/persistence/repositiries/quote-repository.interface';
import { QuoteListQueryDto } from 'src/quote/dto/quote-list-query.dto';
import { Parser } from 'src/parser';
import { Lexer } from 'src/lexer';

@Injectable()
export class QuoteService {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    return this.quoteRepository.getOne(id);
  }

  getList(
    quoteListQueryDto: QuoteListQueryDto,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    const { pagination, filter, sort } = quoteListQueryDto;
    let parsed: QuoteListFilter | undefined;

    if (filter?.q) {
      const lexer = new Lexer(filter.q, [
        'user',
        'author',
        'content',
        'context',
      ]);
      const parser = new Parser(lexer);
      parsed = parser.parse();
    }

    return this.quoteRepository.getList({
      pagination,
      sort,
      filter: parsed,
    });
  }

  create(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    return this.quoteRepository.create(data);
  }

  update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    return this.quoteRepository.update(id, data);
  }

  delete(id: QuoteId): ResultAsync<Quote, DeleteQuoteError> {
    return this.quoteRepository.delete(id);
  }
}
