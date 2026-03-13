import { TaggedError } from 'src/utils/errors/tagged-error';

export class UnexpectedError extends TaggedError('UnexpectedError') {}

export class MissingUserError extends TaggedError('MissingUserError') {}

export class ForbiddenError extends TaggedError('ForbiddenError') {}
