export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type WithTypename<T, Typename extends 'Quote' | 'User'> = T & {
  __typename: Typename;
};
