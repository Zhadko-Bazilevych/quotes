import type { keyChars } from './search-query.constants';

export type KeyChar = (typeof keyChars)[number];

export type TokenType =
  | 'minus'
  | 'colon'
  | 'space'
  | 'keyword'
  | 'unique'
  | 'string'
  | 'eof';

export type Token = {
  type: TokenType;
  literal: string;
};

export type DefaultKeyword = 'common';

export type WithDefaultKeyword<TKeyword extends string> =
  | TKeyword
  | DefaultKeyword;

export type KeywordSearch = {
  include: string[];
  exclude: string[];
};

export type ParsedQuery<TKeyword extends string> = {
  [K in WithDefaultKeyword<TKeyword>]: KeywordSearch;
};

export type Expression<TKeyword extends string> = {
  value: string;
  include: boolean;
  field: WithDefaultKeyword<TKeyword>;
};
