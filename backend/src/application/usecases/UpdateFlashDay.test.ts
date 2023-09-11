import { FlashDay } from "../../domain/FlashDay"
import { Phone } from "../../domain/Phone"
import { FlashDayRepositoryMemory } from "../../infra/repository/FlashDayRepositoryMemory"
import { UpdateFlashDay } from "./UpdateFlashDay"

describe('UpdateFlashDay', () => {
  test('deve atualizar um evento flash day', async () => {
    const flashDayRepository = new FlashDayRepositoryMemory()
    const flashDayId = '123456'
    const artistId = '12345'
    const flashDay = new FlashDay(flashDayId, 'Flash Tattoo #4', new Date(2020, 6, 8), undefined, new Phone('11949729444'), true);
    flashDayRepository.save(flashDay, artistId)
    const usecase = new UpdateFlashDay(flashDayRepository)
    const output = await usecase.execute({
      flashDayId,
      artistId,
      title: 'Flash Tattoo #5',
      startsAt: (new Date(2020, 6, 10)).toISOString(),
      endsAt: (new Date(2020, 6, 11)).toISOString(),
      phone: '11999999999',
      active: false
    })
    const updatedFlashDay = await flashDayRepository.get(flashDayId)
    expect(updatedFlashDay.title).toBe('Flash Tattoo #5')
    expect(updatedFlashDay.startsAt).toEqual(new Date(2020, 6, 10))
    expect(updatedFlashDay.endsAt).toEqual(new Date(2020, 6, 11))
    expect(updatedFlashDay.phone.value).toBe('11999999999')
    expect(updatedFlashDay.active).toBe(false)
  })

  test('deve atualizar apenas alguns dados do evento flash day', async () => {
    const flashDayRepository = new FlashDayRepositoryMemory()
    const flashDayId = '123456'
    const artistId = '12345'
    const flashDay = new FlashDay(flashDayId, 'Flash Tattoo #4',new Date(2020, 6, 8), undefined, new Phone('11949729444'), true);
    flashDayRepository.save(flashDay, artistId)
    const usecase = new UpdateFlashDay(flashDayRepository)
    const output = await usecase.execute({
      flashDayId,
      artistId,
      phone: '11999999999',
      active: false
    })
    const updatedFlashDay = await flashDayRepository.get(flashDayId)
    expect(updatedFlashDay.title).toBe('Flash Tattoo #4')
    expect(updatedFlashDay.startsAt).toEqual(new Date(2020, 6, 8))
    expect(updatedFlashDay.endsAt).toBe(undefined)
    expect(updatedFlashDay.phone.value).toBe('11999999999')
    expect(updatedFlashDay.active).toBe(false)
  })
})
