import { IUserRepository } from "../../application/repository/UserRepository";
import { User } from "../../domain/User";

export class UserRepositoryMemory implements IUserRepository {
  private users = new Map<string, User>()

  async getByEmail(email: string): Promise<User | undefined> {
    for (let [, user] of this.users) {
      if (user.email.value === email)
        return user as User
    }
  }

  async save(user: User): Promise<void> {
    this.users.set(user.userId, user)
  }
}
