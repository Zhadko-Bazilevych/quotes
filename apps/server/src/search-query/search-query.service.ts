import { Injectable } from '@nestjs/common';
import { Lexer } from './lexer';
import { Parser } from './parser';
import type { KeywordToken, ParsedQuery } from './search-query.types';

@Injectable()
export class SearchQueryService<
  TKeywordLiteral extends string,
  TKeyword extends KeywordToken<TKeywordLiteral>,
> {
  constructor(private readonly keywords: readonly TKeyword[] | TKeyword[]) {}

  parse(search: string): ParsedQuery<TKeywordLiteral> {
    //TODO: Can Lexer have generic types implicitly
    const lexer = new Lexer<TKeywordLiteral, TKeyword>(search, this.keywords);
    const parser = new Parser(lexer);
    return parser.parse();
  }
}
