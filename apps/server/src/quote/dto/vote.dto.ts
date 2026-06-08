import z from 'zod';

export const voteQuoteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type VoteQuoteDto = z.infer<typeof voteQuoteSchema>;
