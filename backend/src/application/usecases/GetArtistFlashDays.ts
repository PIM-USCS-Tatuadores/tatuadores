import { IFlashDayRepository } from "../repository/FlashDayRepository";

export class GetArtistFlashDays {
  constructor(readonly flashDayRepository: IFlashDayRepository) {}

  async execute(input: GetArtistFlashDaysInput): Promise<GetArtistFlashDaysOutput> {
    const artistId = input.artistId
    const flashDays = await this.flashDayRepository.getAllByArtist(artistId)
    return flashDays.map(flashDay => ({
      flashDayId: flashDay.flashDayId,
      title: flashDay.title,
      startsAt: flashDay.startsAt.toISOString(),
      endsAt: flashDay.endsAt?.toISOString(),
      phone: flashDay.phone.value,
      active: flashDay.active
    }))
  }
}

type GetArtistFlashDaysInput = {
  artistId: string
}

type GetArtistFlashDaysOutput = {
  flashDayId: string,
  title: string,
  startsAt: string,
  endsAt: string | undefined,
  phone: string,
  active: boolean
}[]
