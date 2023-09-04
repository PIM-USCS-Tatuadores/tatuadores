import { User } from "./User";

describe('User', () => {
  test('Deve criar uma instância de um usuário', () => {
    const user = User.create('john@doe.com', '123456')
    expect(user.userId).toBeDefined()
    expect(user.email.value).toBe('john@doe.com')
    expect(user.password.value).toBeDefined()
  })

  test('Não deve criar um usuário com email inválido', () => {
    expect(() => User.create('john@doecom', '123456')).toThrow(new Error("Invalid email"))
  })

  test('Deve validar a senha do usuário', () => {
    const user = User.create('john@doe.com', '123456')
    expect(user.validatePassword('123456')).toBe(true)
    expect(user.validatePassword('1234')).toBe(false)
  })
})
