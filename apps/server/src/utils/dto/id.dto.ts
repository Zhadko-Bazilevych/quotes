import z from 'zod';

export const idValidator = z.coerce
  .number('should be a number')
  .min(1, { abort: true })
  .pipe(z.int32());

export const idSchema = z.object({
  id: idValidator,
});

export type IdDto = z.infer<typeof idSchema>;
