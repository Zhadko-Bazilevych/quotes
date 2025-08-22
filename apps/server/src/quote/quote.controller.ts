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
import { QuotesService } from 'src/quote/quote.service';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';
import { IdDto, idSchema } from 'src/utils/dto/id.dto';
import { CreateQuoteDto, createQuoteSchema } from './dto/create-quote.dto';
import { matchError } from 'src/utils/errors/match-error';
import {
  UpdateQuoteDto,
  updateQuoteSchema,
} from 'src/quote/dto/update-quote.dto';
import { UnexpectedException } from 'src/utils/exceptions';
import { QuoteNotFoundException } from './quote.errors';
import { UnexpectedError } from 'src/utils/errors/app-errors';
import {
  PaginationOptions,
  paginationSchema,
} from 'src/utils/dto/pagination.dto';
import { Quote, QuoteListResponse } from 'src/quote/quote.types';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  getQuoteById(
    @Param(new ZodValidationPipe(idSchema)) { id }: IdDto,
  ): Promise<Quote> {
    return this.quotesService
      .getOneById(id)
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
    @Query(new ZodValidationPipe(paginationSchema))
    paginationOptions: PaginationOptions,
  ): Promise<QuoteListResponse> {
    return this.quotesService.getList(paginationOptions).match(
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
    @Param(new ZodValidationPipe(idSchema)) { id }: IdDto,
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
    @Param(new ZodValidationPipe(idSchema)) { id }: IdDto,
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
