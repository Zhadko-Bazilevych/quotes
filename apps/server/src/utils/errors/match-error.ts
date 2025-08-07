import { GenericTaggedError } from 'src/utils/errors/tagged-error';

export type Matcher<T extends GenericTaggedError> = {
  [P in T as P['tag']]: (args: P['cause']) => never;
};

export function matchError<T extends GenericTaggedError>(
  error: T,
  matcher: NoInfer<Matcher<T>>,
): never {
  // @ts-expect-error this is safe, ts is cringe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return matcher[error.tag](error.cause);
}
