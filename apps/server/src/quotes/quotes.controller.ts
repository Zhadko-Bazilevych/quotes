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

type Matcher<T extends GenericTaggedError> = {
  [P in T as P['tag']]: (args: P['cause']) => never;
};

type GenericTaggedError = {
  cause: unknown;
  tag: string;
};

function matchError<T extends GenericTaggedError>(
  error: T,
  matcher: NoInfer<Matcher<T>>,
): never {
  // @ts-expect-error this is safe, ts is cringe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return matcher[error.tag](error.cause);
}

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
