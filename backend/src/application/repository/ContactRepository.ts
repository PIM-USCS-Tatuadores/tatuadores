import { Contact } from "../../domain/Contact"

export interface IContactRepository {
  save(contact: Contact, artId: string): Promise<void>;
  getAllFromFlashDay(flashDayId: string, artistId: string): Promise<Contact[]>;
}
