type TokenType =
  | 'quotes'
  | 'minus'
  | 'colon'
  | 'space'
  | 'keyword'
  | 'unique'
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

type Token = {
  type: TokenType;
  literal: string;
};

export class Lexer<Tkeyword extends string> {
  char: string | undefined;
  position = 0;

  constructor(
    private readonly input: string,
    private readonly keywords: SafeKeyword<Tkeyword>[],
  ) {
    input = input.trim();
    if (input) {
      this.char = input[0];
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
      this.readChar();
    }
    const literal = this.input.slice(start, this.position);
    return literal;
  }

  isKeyword(literal: string): boolean {
    return this.keywords.includes(literal as SafeKeyword<Tkeyword>);
  }

  readNext(): Token {
    let token: Token;
    switch (this.char) {
      case '-': {
        token = { literal: this.char, type: 'colon' };
        break;
      }
      case ':': {
        token = { literal: this.char, type: 'colon' };
        break;
      }
      case '"': {
        token = { literal: this.char, type: 'quotes' };
        break;
      }
      case ' ': {
        token = { literal: this.char, type: 'space' };
        break;
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
