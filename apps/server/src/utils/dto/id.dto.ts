import z from 'zod';

export const idSchema = z
  .object({
    id: z.coerce
      .number('should be a number')
      .max(2147483647, { abort: true, error: 'should be <= 2147483647' })
      .min(1, { abort: true, error: 'should be >= 1' })
      .int('should be an integer'),
  })
  .strict();

export type IdDto = z.infer<typeof idSchema>;
