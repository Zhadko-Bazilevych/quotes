import { buildQueryString, type QueryParams } from './build-query-string';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestParams = {
  query?: QueryParams;
  body?: Record<string, unknown>;
};

export async function customFetch<T = unknown>(
  url: string,
  method: Method,
  params?: RequestParams,
): Promise<T> {
  const { query = {}, body } = params ?? {};
  const queryString = buildQueryString(query);

  if (queryString) {
    url = `${url}?${queryString}`;
  }

  const res = await fetch(url, {
    body: JSON.stringify(body),
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = (await res.json()) as T;
  if (!res.ok) {
    // We need to throw an object here for @tanstack/react-query to catch it
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw data;
  }

  return data;
}
