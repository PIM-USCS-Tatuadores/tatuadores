import { IFlashDayRepository } from "../repository/FlashDayRepository";

export class GetFlashDay {
  constructor(readonly flashDayRepository: IFlashDayRepository) {}

  async execute(input: GetFlashDayInput): Promise<GetFlashDayOutput | undefined> {
    const flashDayId = input.flashDayId
    const flashDay = await this.flashDayRepository.get(flashDayId)
    if (flashDay) {
      return {
        flashDayId: flashDay.flashDayId,
        title: flashDay.title,
        startsAt: flashDay.startsAt.toISOString(),
        endsAt: flashDay.endsAt?.toISOString(),
        phone: flashDay.phone.value,
        active: flashDay.active
      }
    }
    return
  }
}

type GetFlashDayInput = {
  flashDayId: string
}

type GetFlashDayOutput = {
  flashDayId: string,
  title: string,
  startsAt: string,
  endsAt: string | undefined,
  phone: string,
  active: boolean
}
