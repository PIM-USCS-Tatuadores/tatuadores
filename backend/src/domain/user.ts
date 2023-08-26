import crypto from 'crypto'
import { Email } from './email'

export class User {
  email: Email

  constructor(
    readonly userId: string,
    readonly name: string,
    email: string,
    readonly role: string,
  ) {
    this.email = new Email(email)
  }

  static create(name: string, email: string, role: string) {
    const userId = crypto.randomUUID()
    return new User(userId, name, email, role)
  }
}
