import { keyChars } from './search-query.constants';
import type { KeyChar, Token, MakeKeywords } from './search-query.types';

export class Lexer<
  TKeywordInput extends string,
  TKeyword extends MakeKeywords<TKeywordInput>,
> {
  private readonly input: string;
  readonly keywords: TKeyword[];
  char: string | undefined;
  peekChar: string | undefined;
  position = 0;

  constructor(input: string, keywords: readonly TKeyword[] | TKeyword[] = []) {
    this.keywords = [...keywords];
    if (!keywords.includes('common' as TKeyword)) {
      this.keywords.push('common' as TKeyword);
    }
    this.input = input.trim();

    this.char = this.input[0];
    this.peekChar = this.input[1];
  }

  readChar(): void {
    if (this.position < this.input.length) {
      this.position++;
    }
    this.char = this.input[this.position];
    this.peekChar = this.input[this.position + 1];
  }

  isKeyChar(): boolean {
    if (!this.char) {
      return false;
    }

    return keyChars.includes(this.char as KeyChar);
  }

  readLiteral(): string {
    let literal: string = '';
    while (this.char && !this.isKeyChar()) {
      if (this.char === '\\') {
        if (this.peekChar === 'n') {
          literal += '\n';
        } else {
          literal += this.peekChar ?? '';
        }
        this.readChar();
        this.readChar();
        continue;
      }
      literal += this.char;
      this.readChar();
    }
    return literal;
  }

  readString(): string {
    this.readChar();
    const start = this.position;

    let literal: string = '';
    while (this.char && this.char !== '"') {
      if (this.char === '\\') {
        if (this.peekChar === 'n') {
          literal += '\n';
        } else {
          literal += this.peekChar ?? '';
        }
        this.readChar();
        this.readChar();
        continue;
      }
      literal += this.char;
      this.readChar();
    }
    if (!this.char) {
      this.position = start - 1;
      this.readChar();
      return '"';
    }

    this.readChar();
    return literal;
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
