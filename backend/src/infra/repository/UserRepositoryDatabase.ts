import pgp from 'pg-promise'
import { User } from "../../domain/User";
import { IUserRepository } from "../../application/repository/UserRepository";
import { IConnection } from '../database/connection';

export class UserRepositoryDatabase implements IUserRepository {
  constructor(readonly connection: IConnection) {}

  async save(user: User) {
    await this.connection.query(`
      INSERT INTO tattoo.user (id, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $4)
    `, [user.userId, user.email.value, user.password.value, new Date()])
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const [data] = await this.connection.query(`
      SELECT * FROM tattoo.user
      WHERE email = $1
    `, [email])
    if (data) {
      return User.restore(data.id, data.email, data.password)
    }
    return
  }
}

