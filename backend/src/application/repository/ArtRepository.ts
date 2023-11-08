import { Art } from "../../domain/Art"

export interface IArtRepository {
  get(artId: string): Promise<Art & { flashDayId: string }>
  getAllByFlashDay(flashDayId: string): Promise<Art[]>
  save(art: Art, flashDayId: string, artistId: string): Promise<void>
  update(art: PartialArt, artistId: string): Promise<void>
}

export type PartialArt = Partial<Art> & {
  artId: string
}
