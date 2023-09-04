import { Artist } from "../../domain/Artist";

export interface IArtistRepository {
  get(artistId: string): Promise<Artist | undefined>
  save(artist: Artist): Promise<void>
}
