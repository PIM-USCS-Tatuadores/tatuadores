import dayjs from "dayjs"
import { FlashDay } from "../../domain/FlashDay"
import { IFlashDayRepository } from "../repository/FlashDayRepository"

export class CreateFlashDay {
  constructor(readonly flashDayRepository: IFlashDayRepository) {}

  async execute(input: CreateFlashDayInput): Promise<CreateFlashDayOutput> {
    const startsAt = dayjs(input.startsAt).toDate()
    const endsAt = input.endsAt ? dayjs(input.endsAt).toDate() : undefined
    const flashDay = FlashDay.create(input.title, startsAt, endsAt, input.phone, input.active)
    await this.flashDayRepository.save(flashDay, input.artistId)
    return {
      flashDayId: flashDay.flashDayId
    }
  }
}

type CreateFlashDayInput = {
  artistId: string,
  title: string,
  startsAt: string,
  endsAt: string | undefined,
  phone: string,
  active: boolean
}

type CreateFlashDayOutput = {
  flashDayId: string
}
