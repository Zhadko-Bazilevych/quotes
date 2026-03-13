import z from 'zod';

import { quoteSchema } from '@/components/quote/form/quote-schema';

export const updateQuoteSchema = quoteSchema.extend({
  userId: z.number().optional(),
});

export type UpdateQuoteSchema = z.infer<typeof updateQuoteSchema>;
