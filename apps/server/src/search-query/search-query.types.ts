import type { keyChars } from './search-query.constants';

export type KeyChar = (typeof keyChars)[number];

export type TokenType =
  | 'minus'
  | 'colon'
  | 'space'
  | 'keyword'
  | 'unique'
  | 'string'
  | 'number'
  | 'eof';

export type Token = {
  type: TokenType;
  literal: string;
};

export type DefaultKeyword = 'common';

export type WithDefaultKeyword<TKeyword extends string> =
  | TKeyword
  | DefaultKeyword;

export type SafeKeyword<TKeyword extends string> = 'invalid' extends {
  [K in TKeyword]: K extends `${string}${KeyChar | '\\'}${string}` | ``
    ? 'invalid'
    : 'valid';
}[TKeyword]
  ? never
  : TKeyword;

export type KeywordLiteral<TLiteral extends string> = WithDefaultKeyword<
  SafeKeyword<TLiteral>
>;

export type KeywordValuesType = 'unique' | 'string' | 'number' | 'date';

export type KeywordToken<TLiteral extends string> = {
  literal: KeywordLiteral<TLiteral>;
  type: KeywordValuesType;
};

export type SearchValueOperations = '>' | '>=' | '<' | '<=' | '=';
export type SearchValueDateTypes = 'h' | 'd' | 'm' | 'y';

export type SearchValueToken = {
  value: string;
  //Followed optional fields are for KeywordValuesType == `date` | `number`
  operation?: SearchValueOperations;
  dateType?: SearchValueDateTypes;
  //TODO: Make it so it know automaticly if they are exist based on type
};

export type KeywordSearch = {
  //type: KeywordValuesType => type can be get from keywordTokens passed to lexer but quote.service (thus kysely) doesn't get them
  include: SearchValueToken[];
  exclude: SearchValueToken[];
};

export type ParsedQuery<TLiteral extends string> = {
  [K in KeywordLiteral<TLiteral>]: KeywordSearch;
};

export type Expression<TKeyword extends string> = {
  type: KeywordValuesType;
  include: boolean;
  field: KeywordLiteral<TKeyword>;
} & SearchValueToken;
