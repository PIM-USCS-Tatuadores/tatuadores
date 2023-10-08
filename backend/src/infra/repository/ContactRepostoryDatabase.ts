import { Art } from '../../domain/Art';
import { IContactRepository } from "../../application/repository/ContactRepository";
import { IConnection } from "../database/connection";
import { Contact } from '../../domain/Contact';

export class ContactRepositoryDatabase implements IContactRepository {
  constructor(readonly connection: IConnection) {}

  async get(contactId: string): Promise<Contact> {
    const [data] = await this.connection.query(`
      SELECT id, title, description, price, size, href, alt_text FROM tattoo.art
      WHERE id = $1
    `, [contactId])
    return this.restoreArt(data)
  }

  async save(contact: Contact): Promise<void> {
    await this.connection.query(`
      INSERT INTO tattoo.contact (id, art_id, name, email, phone, accept_contact, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $7)
    `, [contact.contactId, contact.name, contact.email, contact.phone, contact.acceptContact, new Date()])
  }

  //TODO: voltar aqui 
  private restoreArt(data: ContactDTO) {
    return new Contact(data.id, data.name, data.email, parseInt(data.telephone, 10), data.communicationFlag)
  }
}

type ContactDTO = {
  id: string,
  name: string,
  email: string,
  telephone: string,
  communicationFlag: boolean,
}
