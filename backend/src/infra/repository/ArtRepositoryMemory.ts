import { Art } from '../../domain/Art';
import { IArtRepository } from "../../application/repository/ArtRepository";

export class ArtRepositoryMemory implements IArtRepository {
  private arts = new Map<string, any>()

  async get(artId: string): Promise<Art> {
    return this.arts.get(artId)
  }

  async getAllByFlashDay(flashDayId: string): Promise<Art[]> {
    let arts = []
    for(let [, art] of this.arts) {
      if (art.flashDayId === flashDayId) {
        arts.push(art)
      }
    }
    return arts
  }

  async save(art: Art, flashDayId: string): Promise<void> {
    this.arts.set(art.artId, { ...art, flashDayId })
  }
}
