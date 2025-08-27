export type BaseQueryParam = string | number | null;
export type QueryParam = BaseQueryParam | BaseQueryParam[] | undefined;
export type QueryParams = {
  [key: string]: QueryParam | QueryParams;
};

export function buildQueryString(queryParams: QueryParams): string {
  const urlSearchParams = new URLSearchParams();

  function buildQs(
    queryParams: QueryParams | BaseQueryParam[],
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

        const keyToSet = path ? path + `[${key}]` : key;
        buildQs(value, keyToSet);
        return;
      }

      const keyToSet = path ? path + `[${key}]` : key;
      urlSearchParams.set(keyToSet, value.toString());
    });
  }

  buildQs(queryParams);
  return urlSearchParams.toString();
}
