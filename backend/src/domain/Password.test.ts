import { Password } from "./Password";

describe('Password', () => {
  test('Deve criar uma senha encriptada', () => {
    const password = Password.create('123456')
    expect(password.value).not.toBe('123456')
  })

  test('Deve validar uma senha', () => {
    const password = Password.create('123456')
    expect(password.validate('123456')).toBe(true)
  })

  test('Deve rejeitar uma senha diferente', () => {
    const password = Password.create('123456')
    expect(password.validate('12345')).toBe(false)
  })
})
