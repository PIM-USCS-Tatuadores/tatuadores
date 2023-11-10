import { IContactRepository } from "../../application/repository/ContactRepository";
import { Contact } from '../../domain/Contact';
import { IConnection } from "../database/connection";

export class ContactRepositoryDatabase implements IContactRepository {
  constructor(readonly connection: IConnection) {}

  async save(contact: Contact, artId: string): Promise<void> {
    await this.connection.transaction(async transaction => {
      const data = await transaction.one(`
        SELECT id FROM tattoo.art WHERE id = $1
      `, [artId])
      await transaction.query(`
        INSERT INTO tattoo.contact (id, art_id, name, email, phone, accept_contact, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      `, [contact.contactId, data.id, contact.name, contact.email.value, contact.phone.value, contact.acceptContact, new Date()])
    })
  }

  async getAllFromFlashDay(flashDayId: string, artistId: string): Promise<Contact[]> {
    const data: ContactDTO[] = await this.connection.transaction(async transaction => {
      const data = await transaction.one(`
        SELECT id FROM tattoo.flashday WHERE id = $1 AND artist_id = $2
      `, [flashDayId, artistId])
      return await transaction.query(`
        SELECT contact.* FROM tattoo.contact as contact
        INNER JOIN tattoo.art as art ON contact.art_id = art.id
        INNER JOIN tattoo.flashday as flashday ON art.flashday_id = flashday.id
        WHERE flashday.id = $1
      `, [data.id]) || []
    })
    return data.map(this.restoreContact)
  }

  private restoreContact(data: ContactDTO): Contact {
    return new Contact(data.id, data.name, data.email, data.phone, data.accept_contact)
  }
}

type ContactDTO = {
  id: string,
  name: string,
  email: string,
  phone: string,
  accept_contact: boolean
}
