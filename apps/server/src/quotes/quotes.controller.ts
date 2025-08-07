import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';
import { Quote } from 'src/quotes/quotes.types';
import { IdDto, idSchema } from 'src/utils/dto/id.dto';
import { CreateQuoteDto, createQuoteSchema } from './dto/create-quote.dto';
import { matchError } from 'src/utils/validation/match-error';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  @UsePipes(new ZodValidationPipe(idSchema))
  getQuoteById(@Param() { id }: IdDto): Promise<Quote> {
    return this.quotesService
      .getOneById(id)
      .map((quote) => quote)
      .match(
        (quote) => quote,
        (err) => {
          matchError(err, {
            QuoteNotFoundError: ({ id }) => {
              throw new NotFoundException(`quote with id ${id} not found`);
            },
            UnexpectedError: () => {
              throw new InternalServerErrorException();
            },
          });
        },
      );
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createQuoteSchema))
  createQuote(@Body() body: CreateQuoteDto): Promise<Quote> {
    return this.quotesService.create(body);
  }
}
