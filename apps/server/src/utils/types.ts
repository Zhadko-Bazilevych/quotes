export type BaseRecord = Record<string, unknown>;

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
