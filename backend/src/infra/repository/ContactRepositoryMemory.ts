import { IContactRepository } from "../../application/repository/ContactRepository";
import { Contact } from '../../domain/Contact';

export class ContactRepositoryMemory implements IContactRepository {
  private contacts = new Map<string, any>()

  async get(contactId: string): Promise<Contact> {
    return this.contacts.get(contactId)
  }

  async save(contact: Contact): Promise<void> {
    this.contacts.set(contact.contactId, { ...contact })
  }
}
