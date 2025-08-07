export type GenericTaggedError = {
  cause: unknown;
  _tag: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function TaggedError<Tag extends string>(_tag: Tag) {
  return class TE<Cause = void> extends Error {
    _tag: Tag = _tag;
    override cause: Cause;

    constructor(cause: Cause) {
      super();
      this.cause = cause;
      this.name = _tag;
    }
  };
}
