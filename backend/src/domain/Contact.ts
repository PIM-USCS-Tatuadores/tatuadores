import crypto from 'crypto'

export class Contact {
  constructor(
    readonly contactId: string,
    readonly name: string,
    readonly email: string,
    readonly telephone: number,
    readonly communicationFlag: boolean,
  ) {}

  static create(name: string, email: string, telephone: number, communicationFlag: boolean) {
    const contactId = crypto.randomUUID()
    return new Contact(contactId, name, email, telephone, communicationFlag)
  }
}
