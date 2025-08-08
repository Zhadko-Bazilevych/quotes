import { customFetch, type RequestParams } from './custom-fetch';

export class ApiClient {
  static get<T = unknown>(url: string, params?: RequestParams): Promise<T> {
    return customFetch<T>(url, 'GET', params);
  }

  static post<T = unknown>(url: string, params?: RequestParams): Promise<T> {
    return customFetch<T>(url, 'POST', params);
  }

  static put<T = unknown>(url: string, params?: RequestParams): Promise<T> {
    return customFetch<T>(url, 'PUT', params);
  }

  static patch<T = unknown>(url: string, params?: RequestParams): Promise<T> {
    return customFetch<T>(url, 'PATCH', params);
  }

  static delete<T = unknown>(url: string, params?: RequestParams): Promise<T> {
    return customFetch<T>(url, 'DELETE', params);
  }
}
