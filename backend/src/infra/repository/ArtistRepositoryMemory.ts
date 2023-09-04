import { IArtistRepository } from "../../application/repository/ArtistRepository"
import { Artist } from "../../domain/Artist"

export class ArtistRepositoryMemory implements IArtistRepository {
  private artists = new Map<string, Artist>()

  async get(artistId: string) {
    return this.artists.get(artistId)
  }

  async save(artist: Artist) {
    this.artists.set(artist.artistId, artist)
  }
}
