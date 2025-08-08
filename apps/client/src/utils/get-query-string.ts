export type QueryParam = string | number | undefined;
export type QueryParams = Record<string, QueryParam>;

export function getQueryString(queryParams: QueryParams): string {
  const urlSearchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      urlSearchParams.set(key, `${value}`);
    }
  });

  return urlSearchParams.toString();
}
