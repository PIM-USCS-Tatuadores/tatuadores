import { Art } from '../../domain/Art';
import { IArtRepository } from "../../application/repository/ArtRepository";
import { IConnection } from "../database/connection";

export class ArtRepositoryDatabase implements IArtRepository {
  constructor(readonly connection: IConnection) {}

  async get(artId: string): Promise<Art> {
    const [data] = await this.connection.query(`
      SELECT id, title, description, price, size, href, alt_text FROM tattoo.art
      WHERE id = $1
    `, [artId])
    return new Art(data.id, data.title, data.description, parseFloat(data.price), parseInt(data.size, 10), data.href, data.alt_text)
  }

  async save(art: Art, flashDayId: string): Promise<any> {
    await this.connection.query(`
      INSERT INTO tattoo.art (id, flashday_id, title, description, price, size, href, alt_text, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
    `, [art.artId, flashDayId, art.title, art.description, art.price, art.size, art.href, art.altText, new Date()])
  }
}
