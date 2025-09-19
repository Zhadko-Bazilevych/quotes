import { Lexer, type SafeKeyword } from 'src/lexer';
import { Parser } from 'src/parser';

export function getParser<
  TKeywordInput extends string,
  TKeyword extends SafeKeyword<TKeywordInput | 'common'>,
>(input: string, keywords: TKeyword[] = []): Parser<TKeywordInput, TKeyword> {
  const lexer = new Lexer(input, keywords);
  return new Parser(lexer);
}
