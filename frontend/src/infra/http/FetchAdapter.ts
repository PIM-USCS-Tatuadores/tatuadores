import { IHttpClient, HttpClientOptions } from './HttpClient'

class HTTPError extends Error {
  public data: any

  constructor(message: string, data: any) {
    super(message)

    this.name = "HTTPError"
    this.data = data
  }
}

export class FetchAdapter implements IHttpClient {
  constructor(private readonly baseUrl: string = 'http://localhost:3001/') {}

  getAbsoluteUrl(path: string) {
    const url = new URL(path, this.baseUrl)
    return url.href
  }

  async get(path: string, options?: HttpClientOptions) {
    const response = await fetch(this.getAbsoluteUrl(path), options)
    const json = await response.json()
    if (!response.ok) {
      throw new HTTPError('Request Error', {
        status: response.status,
        message: json.message
      })
    }
    return json
  }

  async post(path: string, data: any, options?: HttpClientOptions) {
    const response = await fetch(this.getAbsoluteUrl(path), {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    })
    const json = await response.json();
    if (!response.ok) {
      throw new HTTPError('Request Error', {
        status: response.status,
        message: json.message
      })
    }
    return json
  }

  async patch(path: string, data: any, options?: HttpClientOptions) {
    const response = await fetch(this.getAbsoluteUrl(path), {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    })
    const json = await response.json();
    if (!response.ok) {
      throw new HTTPError('Request Error', {
        status: response.status,
        message: json.message
      })
    }
    return json
  }
}
