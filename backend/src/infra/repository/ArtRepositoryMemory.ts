import { Art } from '../../domain/Art';
import { IArtRepository } from "../../application/repository/ArtRepository";

export class ArtRepositoryMemory implements IArtRepository {
  private arts = new Map<string, any>()

  async get(artId: string) {
    return this.arts.get(artId)
  }

  async getAllByFlashDay(flashDayId: string) {
    let arts = []
    for(let [, art] of this.arts) {
      if (art.flashDayId === flashDayId) {
        arts.push(art)
      }
    }
    return arts
  }

  async save(art: Art, flashDayId: string) {
    this.arts.set(art.artId, { ...art, flashDayId })
  }
}
