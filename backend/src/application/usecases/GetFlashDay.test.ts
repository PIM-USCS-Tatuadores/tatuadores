import { FlashDay } from "../../domain/FlashDay"
import { FlashDayRepositoryMemory } from "../../infra/repository/FlashDayRepositoryMemory"
import { GetFlashDay } from "./GetFlashDay"

describe('CreateFlashDay', () => {
  test('Deve buscar um evento flash day', async () => {
    const repository = new FlashDayRepositoryMemory()
    const flashDayPayload = {
      title: 'Flash Tattoo #1',
      startsAt: new Date(2023, 10, 12),
      endsAt: new Date(2023, 10, 15),
      phone: '11949729444',
      active: true
    }
    const artistId = '12345'
    const flashDay = FlashDay.create(flashDayPayload.title, flashDayPayload.startsAt, flashDayPayload.endsAt, flashDayPayload.phone, flashDayPayload.active)
    await repository.save(flashDay, artistId)
    const usecase = new GetFlashDay(repository)
    const input = { flashDayId: flashDay.flashDayId }
    const output = await usecase.execute(input)
    expect(output?.flashDayId).toBe(flashDay.flashDayId)
    expect(output?.title).toBe(flashDayPayload.title)
    expect(output?.startsAt).toBe(flashDayPayload.startsAt.toISOString())
    expect(output?.endsAt).toBe(flashDayPayload.endsAt.toISOString())
    expect(output?.phone).toBe(flashDayPayload.phone)
    expect(output?.active).toBe(flashDayPayload.active)
  })
})
