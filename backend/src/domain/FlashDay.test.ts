import { FlashDay } from "./FlashDay"

describe('FlashDay', () => {
  test('Deve criar um flash day', () => {
    const flashDay = FlashDay.create('Flash Tattoo #1', new Date(2023, 10, 12), undefined, '11949729444', true)
    expect(flashDay.flashDayId).toBeDefined()
    expect(flashDay.title).toBe('Flash Tattoo #1')
    expect(flashDay.startsAt).toEqual(new Date(2023, 10, 12))
    expect(flashDay.endsAt).toBeUndefined()
    expect(flashDay.phone.value).toBe('11949729444')
    expect(flashDay.active).toBe(true)
  })

  test('Não deve criar um flash day com um celular inválido', () => {
    expect(() => FlashDay.create('Flash Tattoo #1', new Date(2023, 10, 12), undefined, '11949744', true)).toThrow(new Error("Invalid phone number"))
  })
})
