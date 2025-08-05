import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';
import { ZodValidationPipe } from 'src/utils/pipes/zod-validation-pipe';
import { Quote } from 'src/quotes/quotes.types';
import { IdDto, idSchema } from 'src/utils/dto/id.dto';
import { CreateQuoteDto, createQuoteSchema } from './dto/create-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  @UsePipes(new ZodValidationPipe(idSchema))
  getQuoteById(@Param() params: IdDto): Promise<Quote> {
    return this.quotesService.getQuoteById(params.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createQuoteSchema))
  createQuote(@Body() body: CreateQuoteDto): Promise<Quote> {
    return this.quotesService.createQuote(body);
  }
}
