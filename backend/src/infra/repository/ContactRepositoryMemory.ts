import { IContactRepository } from "../../application/repository/ContactRepository";
import { Contact } from '../../domain/Contact';

export class ContactRepositoryMemory implements IContactRepository {
  private contacts = new Map<string, any>()

  async getAllFromFlashDay(_: string, __: string): Promise<Contact[]> {
    let contacts = []
    for(let [,contact] of this.contacts) {
      contacts.push(contact)
    }
    return contacts
  }

  async save(contact: Contact, artId: string): Promise<void> {
    this.contacts.set(contact.contactId, contact)
  }
}
