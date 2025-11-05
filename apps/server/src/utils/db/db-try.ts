import { ResultAsync } from 'neverthrow';
import { UnexpectedError } from 'src/utils/errors/app-errors';

export function dbTry<T>(
  kyselyPromise: Promise<T>,
): ResultAsync<T, UnexpectedError> {
  return ResultAsync.fromPromise(kyselyPromise, () => new UnexpectedError());
}
