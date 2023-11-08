import { IFlashDayRepository, PartialFlashDay } from "../../application/repository/FlashDayRepository"
import { FlashDay } from "../../domain/FlashDay"

export class FlashDayRepositoryMemory implements IFlashDayRepository {
  private flashDays = new Map<string, any>()

  async get(flashDayId: string) {
    return this.flashDays.get(flashDayId)
  }

  async getAllByArtist(artistId: string): Promise<FlashDay[]> {
    const flashDays = []
    for(let [, flashDay] of this.flashDays) {
      if (flashDay.artistId === artistId) {
        flashDays.push(flashDay)
      }
    }
    return flashDays
  }

  async save(flashDay: FlashDay, artistId: string) {
    this.flashDays.set(flashDay.flashDayId, {
      ...flashDay,
      artistId
    })
  }

  async update(flashDay: PartialFlashDay, artistId: string): Promise<void> {
    const actualFlashDay = this.flashDays.get(flashDay.flashDayId)
    const normalizedFlashDay = this.removeUndefined(flashDay)
    this.flashDays.set(flashDay.flashDayId, Object.assign({},
      actualFlashDay,
      normalizedFlashDay,
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
