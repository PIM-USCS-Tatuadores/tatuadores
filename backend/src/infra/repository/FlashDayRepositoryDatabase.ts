import { IFlashDayRepository, PartialFlashDay } from "../../application/repository/FlashDayRepository";
import { FlashDay } from "../../domain/FlashDay";
import { Phone } from "../../domain/Phone";
import { IConnection } from "../database/connection";

export class FlashDayRepositoryDatabase implements IFlashDayRepository {
  constructor(readonly connection: IConnection) {}

  async get(flashDayId: string) {
    const [data] = await this.connection.query(`
      SELECT id, title, starts_at, ends_at, phone, active
      FROM tattoo.flashday
      WHERE id = $1;
    `, [flashDayId])
    return this.restoreFlashDay(data)
  }

  async getAllByArtist(artistId: string): Promise<FlashDay[]> {
    const data = await this.connection.query(`
      SELECT id, title, starts_at, ends_at, phone, active
      FROM tattoo.flashday
      WHERE artist_id = $1;
    `, [artistId])
    return data?.map(this.restoreFlashDay) || []
  }

  async save(flashDay: FlashDay, artistId: string) {
    await this.connection.query(`
      INSERT INTO tattoo.flashday (id, title, starts_at, ends_at, phone, active, artist_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8);
    `, [flashDay.flashDayId, flashDay.title, flashDay.startsAt, flashDay.endsAt, flashDay.phone.value, flashDay.active, artistId, new Date()])
  }

  async update(flashDay: PartialFlashDay, artistId: string): Promise<void> {
    await this.connection.query(`
      UPDATE tattoo.flashday SET
        title = COALESCE($1, title),
        starts_at = COALESCE($2, starts_at),
        ends_at = COALESCE($3, ends_at),
        phone = COALESCE($4, phone),
        active = COALESCE($5, active),
        updated_at = $6
      WHERE id = $7 AND artist_id = $8;
    `, [flashDay.title, flashDay.startsAt, flashDay.endsAt, flashDay.phone?.value, flashDay.active, new Date(), flashDay.flashDayId, artistId])
  }

  private restoreFlashDay(data: any): FlashDay {
    const startsAt = new Date(data.starts_at)
    const endsAt = data.ends_at ? new Date(data.ends_at) : undefined
    const phone = new Phone(data.phone)
    return new FlashDay(data.id, data.title, startsAt, endsAt, phone, data.active)
  }
}
