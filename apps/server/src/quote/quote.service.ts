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
import { PaginationOptions } from 'src/utils/dto/pagination.dto';
import { Quote } from './domain/quote';
import { QuoteRepository } from './infrastructure/persistence/repositiries/quote-repository.interface';

@Injectable()
export class QuoteService {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    return this.quoteRepository.getOne(id);
  }

  getList(
    paginationOptions: PaginationOptions,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    return this.quoteRepository.getList({ pagination: paginationOptions });
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
