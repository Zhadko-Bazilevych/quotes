type Token = {
  type: string;
  literal: string;
};

export class Lexer<TToken extends Token> {
  char: string | undefined;
  position = 0;
  nextPosition = 1;

  constructor(
    private readonly input: string,
    private readonly tokens: TToken[],
  ) {
    if (input) {
      this.char = input[0];
    }
  }

  readChar(): void {
    if (this.nextPosition >= this.input.length) {
      this.char = undefined;
    } else {
      this.char = this.input[this.nextPosition];
    }
    this.position = this.nextPosition;
    this.nextPosition++;
  }

  isAlphanumeric(): boolean {
    if (this.char) {
      return /^[a-z0-9]$/i.test(this.char);
    }
    return false;
  }

  skipWhitespace(): void {
    while (this.char === ' ') {
      this.readChar();
    }
  }

  getLiteralType(literal: string): string {
    return (
      this.tokens.find((item) => item.literal === literal)?.type ?? 'UNIQUE'
    );
  }

  readNext(): Token {
    const start = this.position;
    this.readChar();
    while (this.isAlphanumeric()) {
      this.readChar();
    }
    const literal = this.input.slice(start, this.position);
    const type = this.getLiteralType(literal);
    return { literal, type };
  }

  readAll(): Token[] {
    const tokens: Token[] = [];
    while (this.char) {
      tokens.push(this.readNext());
    }
    return tokens;
  }
}
