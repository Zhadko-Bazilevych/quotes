export type GenericTaggedError = {
  cause: unknown;
  tag: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function TaggedError<Tag extends string>(tag: Tag) {
  return class TE<Cause = void> extends Error {
    tag: Tag = tag;
    override cause: Cause;

    constructor(cause: Cause) {
      super();
      this.cause = cause;
      this.name = tag;
    }
  };
}
