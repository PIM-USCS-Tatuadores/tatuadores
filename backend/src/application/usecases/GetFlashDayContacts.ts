import { IContactRepository } from "../repository/ContactRepository";

export class GetFlashDayContacts {
  constructor(readonly contactRepository: IContactRepository) {}

  async execute(input: GetFlashDayContactsInput): Promise<GetFlashDayContactsOutput> {
    const contacts = await this.contactRepository.getAllFromFlashDay(input.flashDayId, input.artistId)
    return contacts.map(contact => ({
      id: contact.contactId,
      name: contact.name,
      email: contact.email.value,
      phone: contact.phone.value,
      acceptContact: contact.acceptContact
    }))
  }
}

type GetFlashDayContactsInput = {
  flashDayId: string,
  artistId: string
}

type GetFlashDayContactsOutput = {
  id: string,
  name: string,
  email: string,
  phone: string,
  acceptContact: boolean
}[]
