import crypto from 'crypto'
import { Email } from './Email'
import { Phone } from './Phone'

export class Contact {
  email: Email
  phone: Phone

  constructor(
    readonly contactId: string,
    readonly name: string,
    email: string,
    phone: string,
    readonly acceptContact: boolean,
  ) {
    this.email = new Email(email)
    this.phone = new Phone(phone)
  }

  static create(name: string, email: string, phone: string, acceptContact: boolean) {
    const contactId = crypto.randomUUID()
    return new Contact(contactId, name, email, phone, acceptContact)
  }
}
