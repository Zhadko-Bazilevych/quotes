import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';
import { ZodValidationPipe } from 'src/zod/zodValidationPipe';
import {
  CreateQuoteDto,
  createQuoteSchema,
  getQuoteByIdDto,
  getQuoteByIdSchema,
} from 'src/quotes/quotes.types';

@Controller()
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  @UsePipes(new ZodValidationPipe(getQuoteByIdSchema))
  getQuoteById(@Param() params: getQuoteByIdDto) {
    return this.quotesService.getQuoteById(params.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createQuoteSchema))
  createQuote(@Body() body: CreateQuoteDto) {
    return this.quotesService.createQuote(body);
  }
}
