import type { QuoteId } from 'src/database/tables/quote.tables';
import { newIdSchema } from 'src/utils/dto/id.dto';
import type z from 'zod';

export const quoteIdSchema = newIdSchema<QuoteId>();

export type QuoteIdDto = z.infer<typeof quoteIdSchema>;
