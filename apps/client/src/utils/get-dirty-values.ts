// https://github.com/orgs/react-hook-form/discussions/1991#discussioncomment-13040877
export type DirtyFieldsType =
  | boolean
  | null
  | {
      [key: string]: DirtyFieldsType;
    }
  | DirtyFieldsType[];

export function getDirtyValues<T extends Record<string, unknown>>(
  values: T,
  dirtyFields: Partial<Record<keyof T, DirtyFieldsType>>,
): Partial<T> {
  console.log('getDirtyValuesFn', dirtyFields, values);
  const dirtyValues = Object.keys(dirtyFields).reduce<Partial<T>>(
    (prev, key) => {
      const value = dirtyFields[key];
      if (!value) {
        return prev;
      }
      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);
      const nestedValue =
        isObject && !isArray
          ? getDirtyValues(
              values[key] as Record<string, unknown>,
              value as Partial<Record<string, DirtyFieldsType>>,
            )
          : values[key];
      return { ...prev, [key]: isArray ? values[key] : nestedValue };
    },
    {},
  );
  return dirtyValues;
}
