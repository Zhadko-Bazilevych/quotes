type TokenType =
  | 'quotes'
  | 'minus'
  | 'colon'
  | 'keyword'
  | 'unique'
  | 'eof'
  | 'unknown';
const keyChars = '"-: ' as const;

type Token = {
  type: TokenType;
  literal: string;
};

export class Lexer {
  char: string | undefined;
  position = 0;

  constructor(
    private readonly input: string,
    private readonly keywords: string[],
  ) {
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

  isAlphanumeric(): boolean {
    if (this.char) {
      return /^[a-z0-9]$/i.test(this.char);
    }
    return false;
  }

  isKeyChar(): boolean {
    if (!this.char) {
      return false;
    }
    if (keyChars.includes(this.char)) {
      return true;
    }
    return false;
  }

  skipWhitespace(): void {
    while (this.char === ' ') {
      this.readChar();
    }
  }

  readLiteral(): string {
    const start = this.position;
    while (this.char && !this.isKeyChar()) {
      console.log('read', this.char);
      this.readChar();
    }
    const literal = this.input.slice(start, this.position);
    return literal;
  }

  isKeyword(literal: string): boolean {
    return this.keywords.includes(literal);
  }

  readNext(): Token {
    this.skipWhitespace();
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
