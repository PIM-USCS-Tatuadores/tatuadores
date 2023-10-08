import crypto from 'crypto'

export class Contact {
  constructor(
    readonly contactId: string,
    readonly name: string,
    readonly email: string,
    readonly phone: number,
    readonly acceptContact: boolean,
  ) {}

  static create(name: string, email: string, phone: number, acceptContact: boolean) {
    const contactId = crypto.randomUUID()
    return new Contact(contactId, name, email, phone, acceptContact)
  }
}
