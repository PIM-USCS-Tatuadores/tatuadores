import crypto from 'crypto'
import { Email } from './Email'
import { Password } from './Password'

export class User {
  private constructor(
    readonly userId: string,
    readonly email: Email,
    readonly password: Password
  ) {}

  static create(email: string, password: string) {
    const userId = crypto.randomUUID()
    return new User(userId, new Email(email), Password.create(password))
  }

  static restore(userId: string, email: string, password: string) {
    return new User(userId, new Email(email), new Password(password))
  }

  validatePassword(password: string) {
    return this.password.validate(password)
  }
}
