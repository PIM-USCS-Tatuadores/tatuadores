import { Art } from '../../domain/Art';
import { IArtRepository } from "../../application/repository/ArtRepository";

export class ArtRepositoryMemory implements IArtRepository {
  private arts = new Map<string, any>()

  async get(artId: string): Promise<Art> {
    return this.arts.get(artId)
  }

  async save(art: Art, flashDayId: string): Promise<any> {
    this.arts.set(art.artId, { ...art, flashDayId })
  }
}
