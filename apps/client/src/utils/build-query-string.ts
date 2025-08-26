export type BaseQueryParam = string | number | null;
export type QueryParam = BaseQueryParam | BaseQueryParam[] | undefined;
export type QueryParams = {
  [key: string]: QueryParam | QueryParams;
};

export function buildQueryString(queryParams: QueryParams): string {
  const urlSearchParams = new URLSearchParams();

  function buildQs<T extends QueryParams | BaseQueryParam[]>(
    queryParams: T,
    path: string = '',
  ): void {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          buildQs(value, path + '[]');
          return;
        }
        console.log('inside', key, value, path);
        const keyToSet = path ? path + `[${key}]` : key;
        buildQs(value, keyToSet);
        return;
      }
      console.log('after', key, value, path);
      const keyToSet = path ? path + `[${key}]` : key;
      urlSearchParams.set(keyToSet, value.toString());
    });
  }

  buildQs(queryParams);
  return urlSearchParams.toString();
}
