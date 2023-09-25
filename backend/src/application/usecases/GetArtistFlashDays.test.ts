import { FlashDay } from "../../domain/FlashDay"
import { FlashDayRepositoryMemory } from "../../infra/repository/FlashDayRepositoryMemory"
import { GetArtistFlashDays } from "./GetArtistFlashDays"

describe('GetArtistFlashDays', () => {
  test('Deve buscar todos os eventos flash day de um artista', async () => {
    const repository = new FlashDayRepositoryMemory()
    const artistId = '12345'
    const flashDayPayload1 = {
      title: 'Flash Tattoo #1',
      startsAt: new Date(2023, 10, 12),
      endsAt: new Date(2023, 10, 15),
      phone: '11949729444',
      active: true
    }
    const flashDay1 = FlashDay.create(flashDayPayload1.title, flashDayPayload1.startsAt, flashDayPayload1.endsAt, flashDayPayload1.phone, flashDayPayload1.active)
    await repository.save(flashDay1, artistId)
    const flashDayPayload2 = {
      title: 'Flash Tattoo #2',
      startsAt: new Date(2023, 10, 12),
      endsAt: new Date(2023, 10, 15),
      phone: '11949729445',
      active: false
    }
    const flashDay2 = FlashDay.create(flashDayPayload2.title, flashDayPayload2.startsAt, flashDayPayload2.endsAt, flashDayPayload2.phone, flashDayPayload2.active)
    await repository.save(flashDay2, artistId)
    const usecase = new GetArtistFlashDays(repository)
    const output = await usecase.execute({ artistId })
    expect(output).toEqual([
      {
        flashDayId: flashDay1.flashDayId,
        title: 'Flash Tattoo #1',
        startsAt: new Date(2023, 10, 12).toISOString(),
        endsAt: new Date(2023, 10, 15).toISOString(),
        phone: '11949729444',
        active: true
      },
      {
        flashDayId: flashDay2.flashDayId,
        title: 'Flash Tattoo #2',
        startsAt: new Date(2023, 10, 12).toISOString(),
        endsAt: new Date(2023, 10, 15).toISOString(),
        phone: '11949729445',
        active: false
      }
    ])
  })
})
