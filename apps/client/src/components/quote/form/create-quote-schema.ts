import type z from 'zod';

import { quoteSchema } from '@/components/quote/form/quote-schema';

export const createQuoteSchema = quoteSchema;

export type CreateQuoteSchema = z.infer<typeof createQuoteSchema>;
