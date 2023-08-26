import { User } from "../../domain/user"

export interface IUserRepository {
  get(userId: string): Promise<User>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
  delete(userId: string): Promise<void>
}
