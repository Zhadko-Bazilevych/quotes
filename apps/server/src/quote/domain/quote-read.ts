import type { Quote } from 'src/quote/domain/quote';

export type QuoteRead = Quote & {
  user: string;
};
