import type { UserId } from 'src/database/tables/user.tables';
import type { Quote } from 'src/quote/domain/quote';

export type QuoteAggregate = Quote & {
  user: {
    id: UserId;
    name: string;
  };
};
