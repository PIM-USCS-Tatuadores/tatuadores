import { Email } from "./Email"

describe('Email', () => {
  test('Deve criar um value object com email', () => {
    const email = new Email('john@doe.com')
    expect(email.value).toBe('john@doe.com')
  })

  test('Deve lançar uma exceção para um email inválido', () => {
    expect(() => new Email('johndoe.com')).toThrow(new Error('Invalid email'))
  })
})
