import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';
import { Quote } from 'src/quotes/quotes.types';
import { IdDto, idSchema } from 'src/utils/dto/id.dto';
import { CreateQuoteDto, createQuoteSchema } from './dto/create-quote.dto';
import { matchError } from 'src/utils/errors/match-error';
import {
  UpdateQuoteDto,
  updateQuoteSchema,
} from 'src/quotes/dto/update-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  @UsePipes(new ZodValidationPipe(idSchema))
  getQuoteById(@Param() { id }: IdDto): Promise<Quote> {
    return this.quotesService.getOneById(id).match(
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
    return this.quotesService.create(body).match(
      (quote) => quote,
      (err) => {
        matchError(err, {
          UnexpectedError: () => {
            throw new InternalServerErrorException();
          },
        });
      },
    );
  }

  @Put(':id')
  updateQuote(
    @Param(new ZodValidationPipe(idSchema)) { id }: IdDto,
    @Body(new ZodValidationPipe(updateQuoteSchema)) body: UpdateQuoteDto,
  ): Promise<Quote> {
    return this.quotesService.update(id, body).match(
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

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(idSchema))
  deleteQuote(@Param() { id }: IdDto): Promise<Quote> {
    return this.quotesService.delete(id).match(
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
}
