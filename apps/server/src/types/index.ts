export type WithTypename<T, Typename extends 'Quote' | 'User'> = T & {
  __typename: Typename;
};
