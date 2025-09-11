import z from 'zod';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function buildSortSchema<const T extends ReadonlyArray<string>>(
  fields: T,
) {
  const fieldsWithMinus: Array<T[number] | `-${T[number]}`> = fields.concat(
    fields.map((field) => `-${field}`),
  );

  return z
    .string()
    .transform((s) => s.split(','))
    .pipe(
      z
        .literal(fieldsWithMinus)
        .transform((f) => {
          const startsWithMinus = f.startsWith('-');
          const order = startsWithMinus ? ('desc' as const) : ('asc' as const);
          const field = startsWithMinus
            ? (f.slice(1) as T[number])
            : (f as T[number]);

          return {
            field,
            order,
          };
        })
        .array(),
    )
    .optional();
}
