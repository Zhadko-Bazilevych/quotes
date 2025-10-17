export const QUOTE_SEARCH_QUERY_SERVICE = Symbol('quote-search');
export const QUOTE_SEARCH_QUERY_KEYWORDS = [
  'user',
  'author',
  'content',
  'context',
] as const;

const search = {
  user: 'user.name',
  u: 'user.name',
  author: 'author',
  a: 'author',
  content: 'content',
  cn: 'content',
  ctn: 'content',
  cx: 'context',
  ctx: 'context',
  global: 'common',
  g: 'common',
  c: 'common',
} as const;

type Values = (typeof search)[keyof typeof search];
type Keys = keyof typeof search;
