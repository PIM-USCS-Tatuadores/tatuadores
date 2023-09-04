import { FlashDay } from "../../domain/FlashDay";

export interface IFlashDayRepository {
  get(flashDayId: string): Promise<FlashDay>
  getAllByArtist(artistId: string): Promise<FlashDay[]>
  save(flashDay: FlashDay, artistId: string): Promise<void>
  update(flashDay: PartialFlashDay, artistId: string): Promise<void>
}

export type PartialFlashDay = Partial<FlashDay> & {
  flashDayId: string
}
