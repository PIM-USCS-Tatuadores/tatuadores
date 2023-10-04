import { Art } from "../../domain/Art"

export interface IArtRepository {
  get(artId: string): Promise<Art>
  getAllByFlashDay(flashDayId: string): Promise<Art[]>
  save(art: Art, flashDayId: string, artistId: string): Promise<void>
}
