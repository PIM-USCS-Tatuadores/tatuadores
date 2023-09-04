import { Phone } from "../../domain/Phone";
import { IFlashDayRepository } from "../repository/FlashDayRepository";

export class UpdateFlashDay {
  constructor(readonly flashDayRepository: IFlashDayRepository) {}

  async execute(input: UpdateFlashDayInput): Promise<UpdateFlashDayOutput> {
    const flashDay = {
      flashDayId: input.flashDayId,
      title: input.title,
      startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
      endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
      phone: input.phone ? new Phone(input.phone) : undefined,
      active: input.active
    }
    await this.flashDayRepository.update(flashDay, input.artistId)
    return {
      flashDayId: input.flashDayId
    }
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
