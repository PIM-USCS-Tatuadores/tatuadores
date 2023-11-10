import { Contact } from "../../domain/Contact";
import { IContactRepository } from "../repository/ContactRepository";

export class CreateContact {
  constructor(readonly contactRepository: IContactRepository) {}

  async execute(input: CreateContactInput): Promise<CreateContactOutput> {
    const contact = Contact.create(input.name, input.email, input.phone, input.acceptContact)
    await this.contactRepository.save(contact, input.artId)
    return { contactId: contact.contactId }
  }
}

type CreateContactInput = {
  name: string,
  email: string,
  phone: string,
  acceptContact: boolean,
  artId: string
}

type CreateContactOutput = {
  contactId: string
}
