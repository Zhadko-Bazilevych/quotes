import type z from 'zod';
import { newIdSchema } from 'src/utils/dto/id.dto';
import type { QuoteId } from 'src/quote/quote.types';

export const quoteIdSchema = newIdSchema<QuoteId>();

export type QuoteIdDto = z.infer<typeof quoteIdSchema>;
