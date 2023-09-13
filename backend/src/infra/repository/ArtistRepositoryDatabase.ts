import { IArtistRepository } from "../../application/repository/ArtistRepository";
import { Artist } from "../../domain/Artist";
import { IConnection } from "../database/connection";

export class ArtistRepositoryDatabase implements IArtistRepository {
  constructor(readonly connection: IConnection) {}

  async get(artistId: string) {
    const [data] = await this.connection.query(`
      SELECT id, name, cpf, email FROM tattoo.artist
      WHERE id = $1
    `, [artistId])
    return new Artist(data.id, data.name, data.cpf, data.email)
  }

  async save(artist: Artist) {
    await this.connection.query(`
      INSERT INTO tattoo.artist (id, name, email, cpf, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $5)
    `, [artist.artistId, artist.name, artist.email.value, artist.cpf?.value, new Date()])
  }
}
