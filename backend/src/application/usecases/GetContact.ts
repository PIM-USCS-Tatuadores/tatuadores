import { IContactRepository } from "../repository/ContactRepository";

export class GetArt {
  constructor(readonly contactRepository: IContactRepository) {}

  async execute(input: GetContactInput): Promise<GetContactOutput | undefined> {
    const contact = await this.contactRepository.get(input.contactId)
    if (contact) {
      return {
        contactId: contact.contactId,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        acceptContact: contact.acceptContact,
      }
    }
    return
  }
}

type GetContactInput = {
  contactId: string
}

type GetContactOutput = {
  contactId: string,
  name: string,
  email: string,
  phone: number,
  acceptContact: boolean
}
