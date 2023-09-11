export type HttpClientOptions = {
  signal?: AbortSignal,
  headers?: any,
  credentials?: RequestCredentials
}

export interface IHttpClient {
  get(url: string, options?: HttpClientOptions): Promise<any>;
  post(url: string, data: any, options?: HttpClientOptions): Promise<any>;
  patch(url: string, data: any, options?: HttpClientOptions): Promise<any>;
}
