import { INT_MAX } from 'src/utils/constants';
import z from 'zod';

export const idFieldValidator = z.coerce
  .number('should be a number')
  .max(INT_MAX, { abort: true, error: `should be <= ${INT_MAX}` })
  .min(1, { abort: true, error: 'should be >= 1' })
  .int('should be an integer');

export const idSchema = z
  .object({
    id: idFieldValidator,
  })
  .strict();

export type IdDto = z.infer<typeof idSchema>;
