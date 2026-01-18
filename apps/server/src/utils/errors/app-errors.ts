import { TaggedError } from 'src/utils/errors/tagged-error';

export class UnexpectedError extends TaggedError('UnexpectedError') {}

export class UnauthorizedError extends TaggedError('UnauthorizedError') {}

export class ForbiddenError extends TaggedError('ForbiddenError') {}
