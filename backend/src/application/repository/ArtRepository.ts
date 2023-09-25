import { Art } from "../../domain/Art"

export interface IArtRepository {
  get(artId: string): Promise<Art>
  save(art: Art, flashDayId: string): Promise<any>
}
