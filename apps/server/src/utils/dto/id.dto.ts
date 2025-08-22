import z from 'zod';
import type { Brand } from 'src/utils/types';

export function newIdValueSchema<
  TBrand extends Brand<number, string>,
>(): z.ZodType<TBrand> {
  return z.coerce
    .number('should be a number')
    .min(1, { abort: true })
    .pipe(z.int32()) as unknown as z.ZodType<TBrand>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function newIdSchema<TBrand extends Brand<number, string>>() {
  return z.object({
    id: newIdValueSchema<TBrand>(),
  });
}
