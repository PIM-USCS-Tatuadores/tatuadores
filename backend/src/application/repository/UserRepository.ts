import { User } from "../../domain/User"

export interface IUserRepository {
  save(user: User): Promise<void>
  getByEmail(email: string): Promise<User | undefined>
}
