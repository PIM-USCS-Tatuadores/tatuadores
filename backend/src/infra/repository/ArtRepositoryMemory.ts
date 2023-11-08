import { Art } from '../../domain/Art';
import { IArtRepository, PartialArt } from "../../application/repository/ArtRepository";

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

  async update(art: PartialArt, artistId: string) {
    const actualArt = this.arts.get(art.artId)
    this.arts.set(art.artId, Object.assign(
      {},
      actualArt,
      this.removeUndefined(art),
      { artistId }
    ))
  }

  private removeUndefined(object: Record<string, any>) {
    return Object.keys(object).reduce((obj, key) => {
      if (object[key] !== undefined) {
        return { ...obj, [key]: object[key] }
      }
      return obj
    }, {})
  }
}
