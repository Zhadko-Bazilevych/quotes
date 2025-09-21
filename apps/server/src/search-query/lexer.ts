import { keyChars } from './search-query.constants';
import type {
  SafeKeyword,
  KeyChar,
  Token,
  WithDefaultKeyword,
} from './search-query.types';

export class Lexer<
  TKeywordInput extends string,
  TKeyword extends WithDefaultKeyword<SafeKeyword<TKeywordInput>>,
> {
  private readonly input: string;
  readonly keywords: TKeyword[];
  char: string | undefined;
  position = 0;

  constructor(input: string, keywords: TKeyword[]) {
    this.keywords = [...keywords];
    if (!keywords.includes('common' as TKeyword)) {
      this.keywords.push('common' as TKeyword);
    }

    this.input = input.trim();
    if (this.input) {
      this.char = this.input[0];
    }
  }

  readChar(): void {
    if (this.position >= this.input.length) {
      this.char = undefined;
      return;
    }
    this.position++;
    this.char = this.input[this.position];
  }

  isKeyChar(): boolean {
    if (!this.char) {
      return false;
    }

    return keyChars.includes(this.char as KeyChar);
  }

  readLiteral(): string {
    const start = this.position;
    while (this.char && !this.isKeyChar()) {
      if (this.char === '\\') {
        this.readChar();
      }
      this.readChar();
    }

    let literal = this.input.slice(start, this.position);
    literal = literal.replace(/\\(.)/g, '$1');
    return literal;
  }

  readString(): string {
    this.readChar();
    const start = this.position;
    const startChar = this.char;
    while (this.char && this.char !== '"') {
      if (this.char === '\\') {
        this.readChar();
      }
      this.readChar();
    }
    if (!this.char) {
      this.position = start;
      this.char = startChar;
      return '"';
    }
    let string = this.input.slice(start, this.position);
    this.readChar();

    string = string.replace(/\\(.)/g, '$1');
    return string;
  }

  isKeyword(literal: string): boolean {
    return this.keywords.includes(literal as TKeyword);
  }

  readNext(): Token {
    let token: Token;
    switch (this.char) {
      case ' ': {
        token = { literal: this.char, type: 'space' };
        break;
      }
      case '-': {
        token = { literal: this.char, type: 'minus' };
        break;
      }
      case ':': {
        token = { literal: this.char, type: 'colon' };
        break;
      }
      case '"': {
        const literal = this.readString();
        const type = literal === '"' ? 'unique' : 'string';
        return { literal, type };
      }
      case undefined: {
        token = { literal: '', type: 'eof' };
        break;
      }
      default: {
        const literal = this.readLiteral();
        const type = this.isKeyword(literal) ? 'keyword' : 'unique';
        return { literal, type };
      }
    }
    this.readChar();
    return token;
  }

  readAll(): Token[] {
    const tokens: Token[] = [];
    while (this.char) {
      tokens.push(this.readNext());
    }
    return tokens;
  }
}
