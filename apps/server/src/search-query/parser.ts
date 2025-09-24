import type { Lexer } from 'src/search-query/lexer';
import type {
  Expression,
  KeywordLiteral,
  KeywordToken,
  ParsedQuery,
  Token,
} from './search-query.types';

export class Parser<
  TKeywordLiteral extends string,
  TKeyword extends KeywordToken<TKeywordLiteral>,
> {
  private currentToken: Token;
  private peekToken: Token;

  private currentExpression: Expression<TKeywordLiteral>;
  private expressions: ParsedQuery<TKeywordLiteral>;

  constructor(private readonly lexer: Lexer<TKeywordLiteral, TKeyword>) {
    this.currentToken = this.lexer.readNext();
    this.peekToken = this.lexer.readNext();

    this.currentExpression = {
      field: 'common',
      type: 'string',
      value: '',
      include: true,
    };
    this.expressions = this.lexer.keywords.reduce(
      (acc, curr) => ({
        [curr['literal']]: { include: [], exclude: [] },
        ...acc,
      }),
      { common: { include: [], exclude: [] } } as ParsedQuery<TKeywordLiteral>,
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
    const listType = this.currentExpression.include ? 'include' : 'exclude';
    this.expressions[this.currentExpression.field][listType].push({
      value: this.currentExpression.value,
    });
    this.clearValue();
  }

  parse(): ParsedQuery<TKeywordLiteral> {
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
              .literal as KeywordLiteral<TKeywordLiteral>;
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
