import { Art } from '../../domain/Art';
import { IArtRepository, PartialArt } from "../../application/repository/ArtRepository";
import { IConnection } from "../database/connection";

export class ArtRepositoryDatabase implements IArtRepository {
  constructor(readonly connection: IConnection) {}

  async get(artId: string) {
    const [data] = await this.connection.query(`
      SELECT id, title, description, price, size, href, alt_text, flashday_id
      FROM tattoo.art
      WHERE id = $1
    `, [artId])

    return {
      ...this.restoreArt(data),
      flashDayId: data.flashday_id
    }
  }

  async getAllByFlashDay(flashDayId: string): Promise<Art[]> {
    const data = await this.connection.query(`
      SELECT id, title, description, price, size, href, alt_text FROM tattoo.art
      WHERE flashday_id = $1
    `, [flashDayId])
    return data.map(this.restoreArt)
  }

  async save(art: Art, flashDayId: string, artistId: string): Promise<void> {
    await this.connection.transaction(async (transaction) => {
      const data = await transaction.one(`
        SELECT id FROM tattoo.flashday WHERE id = $1 AND artist_id = $2
      `, [flashDayId, artistId])
      await transaction.query(`
        INSERT INTO tattoo.art (id, flashday_id, title, description, price, size, href, alt_text, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      `, [art.artId, data.id, art.title, art.description, art.price, art.size, art.href, art.altText, new Date()])
    })
  }

  async update(art: PartialArt, artistId: string): Promise<void> {
    await this.connection.transaction(async (transaction) => {
      const data = await transaction.one(`
        SELECT art.id FROM tattoo.art as art
        INNER JOIN tattoo.flashday as flashday ON art.flashday_id = flashday.id
        INNER JOIN tattoo.artist as artist ON flashday.artist_id = artist.id
        WHERE art.id = $1 AND flashday.artist_id = $2
      `, [art.artId, artistId])
      await transaction.query(`
        UPDATE tattoo.art SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          size = COALESCE($4, size),
          href = COALESCE($5, href),
          alt_text = COALESCE($6, alt_text),
          updated_at = $7
        WHERE id = $8;
      `, [art.title, art.description, art.price, art.size, art.href, art.altText, new Date(), data.id])
    })
  }

  private restoreArt(data: ArtDTO) {
    return new Art(data.id, data.title, data.description, parseFloat(data.price), parseInt(data.size, 10), data.href, data.alt_text)
  }
}

type ArtDTO = {
  id: string,
  title: string,
  description: string,
  price: string,
  size: string,
  href: string,
  alt_text: string
}
