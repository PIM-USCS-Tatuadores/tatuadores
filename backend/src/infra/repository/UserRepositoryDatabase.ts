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

  // async get(userId: string): Promise<User> {
  //   const [userData] = await this.connection.query('SELECT * FROM tattoo.user WHERE id = $1 AND deleted_at IS NULL', [userId])
  //   return new User(userData.id, userData.name, userData.email, userData.role)
  // }

  // async save(user: User): Promise<void> {
  //   await this.connection.query('INSERT INTO tattoo.user (id, name, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)', [user.userId, user.name, user.email.value, user.role, new Date(), new Date()])
  // }

  // async update(user: User): Promise<void> {
  //   await this.connection.query('UPDATE tattoo.user SET name = $1, email = $2, role = $3, updated_at = $4 WHERE id = $5', [user.name, user.email.value, user.role, new Date(), user.userId])
  // }

  // async delete(userId: string): Promise<void> {
  //   await this.connection.query('UPDATE tattoo.user SET deleted_at = $1 WHERE id = $2', [new Date(), userId])
  // }
}
