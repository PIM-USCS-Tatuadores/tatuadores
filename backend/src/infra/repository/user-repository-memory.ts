import { IUserRepository } from "../../application/repository/user-repository";
import { User } from "../../domain/user";

export class UserRepositoryMemory implements IUserRepository {
  private users = new Map<string, User>()

  async get(userId: string): Promise<User> {
    const user = this.users.get(userId)
    return user as User
  }

  async save(user: User): Promise<void> {
    this.users.set(user.userId, user)
  }

  async update(user: User): Promise<void> {
    this.users.set(user.userId, user)
  }

  async delete(userId: string): Promise<void> {
    this.users.delete(userId)
  }
}
