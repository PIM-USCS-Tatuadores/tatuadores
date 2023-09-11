import { FlashDayRepositoryMemory } from "../../infra/repository/FlashDayRepositoryMemory"
import { CreateFlashDay } from "./CreateFlashDay"

describe('CreateFlashDay', () => {
  test('Deve criar um evento flash day', async () => {
    const usecase = new CreateFlashDay(new FlashDayRepositoryMemory())
    const input = {
      title: 'Flash Tattoo #1',
      startsAt: (new Date(2023, 10, 12)).toISOString(),
      endsAt: undefined,
      phone: '11949729444',
      active: true,
      artistId: '12345'
    }
    const output = await usecase.execute(input)
    expect(output.flashDayId).toBeDefined()
  })
})
