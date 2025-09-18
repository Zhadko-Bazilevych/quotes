type TokenType =
  | 'minus'
  | 'colon'
  | 'space'
  | 'keyword'
  | 'unique'
  | 'string'
  | 'eof';

const keyChars = ['"', '-', ':', ' '] as const;
type KeyChar = (typeof keyChars)[number];
type SafeKeyword<TKeyword extends string> = 'invalid' extends {
  [K in TKeyword]: K extends `${string}${KeyChar}${string}`
    ? 'invalid'
    : 'valid';
}[TKeyword]
  ? never
  : TKeyword;

export type Token = {
  type: TokenType;
  literal: string;
};

export class Lexer<Tkeyword extends string> {
  private readonly input: string;
  char: string | undefined;
  position = 0;

  constructor(
    input: string,
    readonly keywords: SafeKeyword<Tkeyword>[],
  ) {
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
    if (keyChars.includes(this.char as KeyChar)) {
      return true;
    }
    return false;
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
    return this.keywords.includes(literal as SafeKeyword<Tkeyword>);
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
