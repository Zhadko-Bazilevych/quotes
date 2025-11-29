import { Injectable } from '@nestjs/common';

import { Lexer } from './lexer';
import { Parser } from './parser';
import type { ParsedQuery } from './search-query.types';

@Injectable()
export class SearchQueryService<TAlias extends string> {
  constructor(private readonly keywords: Record<string, TAlias>) {}

  parse(search: string): ParsedQuery<TAlias> {
    const lexer = new Lexer(search, Object.keys(this.keywords));
    const parser = new Parser(lexer, this.keywords);

    return parser.parse();
  }
}
