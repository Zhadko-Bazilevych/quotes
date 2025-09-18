import { Lexer } from 'src/lexer';
import { Parser } from 'src/parser';

const lexerKeys = ['user', 'author', 'content', 'context', 'common'];
type LexerKey = (typeof lexerKeys)[number];

export function getParser(input: string): Parser<LexerKey> {
  const lexer = new Lexer(input, lexerKeys);
  return new Parser(lexer);
}
