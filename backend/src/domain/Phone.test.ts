import { Phone } from "./Phone"

describe('Phone', () => {
  test('Deve criar um value object com email', () => {
    const phone = new Phone('11949729444')
    expect(phone.value).toBe('11949729444')
  })

  test('Deve lançar uma exceção para um email inválido', () => {
    expect(() => new Phone('11949729')).toThrow(new Error('Invalid phone number'))
  })
})
