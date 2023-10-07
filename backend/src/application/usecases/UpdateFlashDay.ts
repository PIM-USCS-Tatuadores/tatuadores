import dayjs from "dayjs";
import { Phone } from "../../domain/Phone";
import { IFlashDayRepository } from "../repository/FlashDayRepository";

export class UpdateFlashDay {
  constructor(readonly flashDayRepository: IFlashDayRepository) {}

  async execute(input: UpdateFlashDayInput): Promise<UpdateFlashDayOutput> {
    const flashDay = {
      flashDayId: input.flashDayId,
      title: input.title,
      startsAt: input.startsAt ? dayjs(input.startsAt).toDate() : undefined,
      endsAt: input.endsAt ? dayjs(input.endsAt).toDate() : undefined,
      phone: input.phone ? new Phone(input.phone) : undefined,
      active: input.active
    }
    await this.flashDayRepository.update(flashDay, input.artistId)
    return { flashDayId: input.flashDayId }
  }
}

type UpdateFlashDayInput = {
  artistId: string,
  flashDayId: string,
  title?: string,
  startsAt?: string,
  endsAt?: string,
  phone?: string,
  active?: boolean
}

type UpdateFlashDayOutput = {
  flashDayId: string
}
