import { IHttpClient } from "../http/HttpClient";
import { AuthGatewayOptions, IAuthGateway, User, UserDTO } from "./Auth";

export class AuthGateway implements IAuthGateway {
  constructor(readonly httpClient: IHttpClient) {}

  async register(name: string, email: string, password: string): Promise<void> {
    await this.httpClient.post('/api/v1/artists/register', {
      name,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async login(email: string, password: string): Promise<void> {
    await this.httpClient.post('/api/v1/login', {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  }

  async getUser(options?: AuthGatewayOptions): Promise<User> {
    const response: UserDTO = await this.httpClient.get('/api/v1/current_user', {
      signal: options?.signal,
      credentials: 'include',
      headers: Object.assign({}, options?.headers, {
        'Contect-Type': 'application/json'
      })
    })
    return {
      id: response.id,
      email: response.email,
      name: response.name
    }
  }
}
