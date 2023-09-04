export interface IAuthGateway {
  register(email: string, password: string, options?: AuthGatewayOptions): Promise<void>
  login(email: string, password: string, options?: AuthGatewayOptions): Promise<{ token: string }>
  getUser(options?: AuthGatewayOptions): Promise<User>
}

export type User = {
  id: string,
  email: string,
  name?: string
}

export type UserDTO = {
  id: string,
  email: string,
  name?: string
}

export type AuthGatewayOptions = {
  signal?: AbortSignal,
  headers?: any
}
