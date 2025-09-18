import type { Lexer, Token } from 'src/lexer';

export type KeywordSearch = {
  value: string;
  include: boolean;
};

export type ParsedQuery<TKeyword extends string> = {
  [K in TKeyword]: KeywordSearch[];
} & {
  common: KeywordSearch[];
};

type Expression<TKeyword extends string> = {
  field: TKeyword | 'common';
} & KeywordSearch;

export class Parser<TKeyword extends string> {
  private currentToken: Token;
  private peekToken: Token;

  private currentExpression: Expression<TKeyword>;
  private expressions: ParsedQuery<TKeyword>;

  constructor(private readonly lexer: Lexer<TKeyword>) {
    this.currentToken = this.lexer.readNext();
    this.peekToken = this.lexer.readNext();

    this.currentExpression = {
      field: 'common',
      value: '',
      include: true,
    };
    this.expressions = this.lexer.keywords.reduce(
      (acc, curr) => ({
        [curr]: [],
        ...acc,
      }),
      { common: [] } as ParsedQuery<TKeyword>,
    );
  }

  nextToken(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.readNext();
  }

  clearValue(): void {
    this.currentExpression.include = true;
    this.currentExpression.value = '';
  }

  concatLiteral(): void {
    this.currentExpression.value += this.currentToken.literal;
  }

  pushValue(): void {
    if (!this.currentExpression.value) {
      this.clearValue();
      return;
    }
    if (!this.currentExpression.field) {
      this.currentExpression.field = 'common';
    }
    this.expressions[this.currentExpression.field].push({
      value: this.currentExpression.value,
      include: this.currentExpression.include,
    });
    this.clearValue();
  }

  parse(): ParsedQuery<TKeyword> {
    while (this.currentToken.type !== 'eof') {
      switch (this.currentToken.type) {
        case 'space': {
          this.pushValue();
          break;
        }
        case 'minus': {
          if (this.currentExpression.value) {
            this.concatLiteral();
            break;
          }
          if (
            this.peekToken.type === 'space' ||
            this.peekToken.type === 'eof'
          ) {
            break;
          }
          if (!this.currentExpression.include) {
            this.concatLiteral();
            break;
          }
          this.currentExpression.include = false;
          break;
        }
        case 'keyword': {
          if (this.currentExpression.value || !this.currentExpression.include) {
            this.concatLiteral();
            break;
          }
          if (this.peekToken.type === 'colon') {
            this.currentExpression.field = this.currentToken
              .literal as TKeyword;
            this.nextToken();
            break;
          }
          this.concatLiteral();
          break;
        }
        case 'colon': {
          this.concatLiteral();
          break;
        }
        case 'unique': {
          this.concatLiteral();
          break;
        }
        case 'string': {
          if (this.currentExpression.value) {
            this.pushValue();
          }
          this.concatLiteral();
          this.pushValue();
          break;
        }
      }
      this.nextToken();
    }
    this.pushValue();
    return this.expressions;
  }
}
