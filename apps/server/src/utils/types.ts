export type BaseRecord = Record<string, unknown>;

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };
