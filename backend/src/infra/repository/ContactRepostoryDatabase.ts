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
    
  }

  // async save(art: Contact): Promise<void> {
  //   await this.connection.query(`
  //     INSERT INTO tattoo.art (id, flashday_id, title, description, price, size, href, alt_text, created_at, updated_at)
  //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
  //   `, [art.artId, flashDayId, art.title, art.description, art.price, art.size, art.href, art.altText, new Date()])
  // }

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
