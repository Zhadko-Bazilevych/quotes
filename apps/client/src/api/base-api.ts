export class BaseApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected buildUrl(...path: (string | number)[]): string {
    return this.baseUrl + path.join('/');
  }
}
