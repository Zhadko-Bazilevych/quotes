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
  field?: TKeyword | 'common';
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
      field: undefined,
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

  clearExpression(): void {
    this.currentExpression = {
      field: undefined,
      value: '',
      include: true,
    };
  }

  pushExpression(): void {
    if (!this.currentExpression.value) {
      this.clearExpression();
      return;
    }
    if (!this.currentExpression.field) {
      this.currentExpression.field = 'common';
    }
    this.expressions[this.currentExpression.field].push({
      value: this.currentExpression.value,
      include: this.currentExpression.include,
    });
    this.clearExpression();
  }

  parse(): ParsedQuery<TKeyword> {
    while (this.currentToken.type !== 'eof') {
      switch (this.currentToken.type) {
        case 'minus': {
          this.pushExpression();
          this.currentExpression.include = false;
          break;
        }
        case 'colon': {
          this.clearExpression();
          break;
        }
        case 'keyword': {
          if (this.peekToken.type !== 'colon') {
            if (this.currentExpression.value) {
              this.pushExpression();
            }
            this.currentExpression.value = this.currentToken.literal;
            break;
          }

          if (this.currentExpression.value) {
            this.pushExpression();
            this.currentExpression.field = this.currentToken
              .literal as TKeyword;
          } else if (this.currentExpression.field) {
            this.currentExpression.value = this.currentToken.literal;
          } else {
            this.currentExpression.field = this.currentToken
              .literal as TKeyword;
          }
          this.nextToken();
          break;
        }
        case 'unique':
        case 'string': {
          if (this.currentExpression.value) {
            this.pushExpression();
          }
          this.currentExpression.value = this.currentToken.literal;
          break;
        }
      }
      this.nextToken();
    }
    this.pushExpression();
    return this.expressions;
  }
}
