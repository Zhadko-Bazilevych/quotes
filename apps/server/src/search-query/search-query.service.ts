import { Injectable } from '@nestjs/common';
import { Lexer } from './lexer';
import { Parser } from './parser';
import type {
  ParsedQuery,
  SafeKeyword,
  WithDefaultKeyword,
} from './search-query.types';

@Injectable()
export class SearchQueryService<
  TKeywordInput extends string,
  TKeyword extends WithDefaultKeyword<SafeKeyword<TKeywordInput>>,
> {
  constructor(private readonly keywords: readonly TKeyword[] | TKeyword[]) {}

  parse(search: string): ParsedQuery<TKeyword> {
    const lexer = new Lexer(search, this.keywords);
    const parser = new Parser(lexer);

    return parser.parse();
  }
}
