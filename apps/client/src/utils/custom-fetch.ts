import { getQueryString, type QueryParams } from './get-query-string';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestParams = {
  query?: QueryParams;
  body?: Record<string, unknown>;
};

export function customFetch<T = unknown>(
  url: string,
  method: Method,
  params?: RequestParams,
): Promise<T> {
  const { query = {}, body } = params ?? {};
  const queryString = getQueryString(query);

  if (queryString) {
    url = `${url}?${queryString}`;
  }

  return fetch(url, {
    body: JSON.stringify(body),
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json()) as Promise<T>;
}
