export const QUOTE_SEARCH_QUERY_SERVICE = Symbol('quote-search');
export const QUOTE_SEARCH_QUERY_KEYWORDS = [
  { literal: 'user', type: 'string' },
  { literal: 'author', type: 'string' },
  { literal: 'content', type: 'string' },
  { literal: 'context', type: 'string' },
  { literal: 'uploaded', type: 'date' },
] as const;
