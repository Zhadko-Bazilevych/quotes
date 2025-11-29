import z from 'zod';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function buildSortSchema<T extends string>(fields: T[]) {
  const fieldsWithMinus: (T | `-${T}`)[] = [];
  for (const field of fields) {
    fieldsWithMinus.push(field);
    fieldsWithMinus.push(`-${field}`);
  }

  return z
    .string()
    .transform((s) => s.split(','))
    .pipe(
      z
        .literal(fieldsWithMinus)
        .transform((f) => {
          const startsWithMinus = f.startsWith('-');
          const order = startsWithMinus ? ('desc' as const) : ('asc' as const);
          const field = (startsWithMinus ? f.slice(1) : f) as T;

          return {
            field,
            order,
          };
        })
        .array(),
    )
    .optional();
}
