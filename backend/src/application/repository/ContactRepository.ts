import { Art } from "../../domain/Art"
import { Contact } from "../../domain/Contact"

export interface IContactRepository {
  get(contactId: string): Promise<Contact>
  save(contact: Contact): Promise<void>
}
