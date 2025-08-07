import { type GenericTaggedError } from 'src/utils/errors/tagged-error';

export type Matcher<T extends GenericTaggedError> = {
  [P in T as P['_tag']]?: (args: P['cause']) => never;
};

type NarrowError<E extends GenericTaggedError, M extends Matcher<E>> = Exclude<
  E,
  { _tag: keyof M }
>;

export function matchError<E extends GenericTaggedError, M extends Matcher<E>>(
  error: E,
  matcher: M,
): NarrowError<E, M> {
  // @ts-expect-error this is safe, ts is cringe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call,
  return matcher[error._tag]?.(error.cause) ?? error;
}
