import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuoteService } from 'src/quote/quote.service';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';
import { CreateQuoteDto, createQuoteSchema } from './dto/create-quote.dto';
import { matchError } from 'src/utils/errors/match-error';
import {
  UpdateQuoteDto,
  updateQuoteSchema,
} from 'src/quote/dto/update-quote.dto';
import { UnexpectedException } from 'src/utils/exceptions';
import { QuoteNotFoundException } from './quote.errors';
import { UnexpectedError } from 'src/utils/errors/app-errors';
import { QuoteList } from 'src/quote/quote.types';
import { QuoteIdDto, quoteIdSchema } from './dto/quote-id.dto';
import { Quote } from './domain/quote';
import {
  QuoteListQueryDto,
  quoteListQuerySchema,
} from 'src/quote/dto/quote-list-query.dto';
import { OptionalAuth } from 'src/auth/auth.guard';

@OptionalAuth()
@Controller('quotes')
export class QuoteController {
  constructor(private readonly quotesService: QuoteService) {}

  @Get(':id')
  getQuoteById(
    @Param(new ZodValidationPipe(quoteIdSchema)) { id }: QuoteIdDto,
  ): Promise<Quote> {
    return this.quotesService
      .getOne(id)
      .mapErr((error) =>
        matchError(error, {
          QuoteNotFoundError: ({ id }) => new QuoteNotFoundException(id),
        }),
      )
      .match(
        (quote) => quote,
        () => {
          throw new UnexpectedError();
        },
      );
  }

  @Get()
  getList(
    @Query(new ZodValidationPipe(quoteListQuerySchema))
    searchOptions: QuoteListQueryDto,
  ): Promise<QuoteList> {
    return this.quotesService.getList(searchOptions).match(
      (quote) => quote,
      (err) =>
        matchError(err, {
          UnexpectedError: () => new UnexpectedException(),
        }),
    );
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createQuoteSchema)) body: CreateQuoteDto,
  ): Promise<Quote> {
    return this.quotesService.create(body).match(
      (quote) => quote,
      (err) =>
        matchError(err, {
          UnexpectedError: () => new UnexpectedException(),
        }),
    );
  }

  @Put(':id')
  update(
    @Param(new ZodValidationPipe(quoteIdSchema)) { id }: QuoteIdDto,
    @Body(new ZodValidationPipe(updateQuoteSchema)) body: UpdateQuoteDto,
  ): Promise<Quote> {
    return this.quotesService.update(id, body).match(
      (quote) => quote,
      (err) =>
        matchError(err, {
          QuoteNotFoundError: ({ id }) => new QuoteNotFoundException(id),
          UnexpectedError: () => new UnexpectedException(),
        }),
    );
  }

  @Delete(':id')
  delete(
    @Param(new ZodValidationPipe(quoteIdSchema)) { id }: QuoteIdDto,
  ): Promise<Quote> {
    return this.quotesService.delete(id).match(
      (quote) => quote,
      (err) =>
        matchError(err, {
          QuoteNotFoundError: ({ id }) => new QuoteNotFoundException(id),
          UnexpectedError: () => new UnexpectedException(),
        }),
    );
  }
}
