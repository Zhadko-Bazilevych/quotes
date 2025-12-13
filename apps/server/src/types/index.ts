export type WithTypename<T, Typename extends 'Quote'> = T & {
  __typename: Typename;
};
