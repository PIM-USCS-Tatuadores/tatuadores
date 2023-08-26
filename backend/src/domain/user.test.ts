import { User } from "./user";

describe('User', () => {
  test('Deve criar uma instância de um usuário', () => {
    expect(new User('1', 'John Doe', 'john@doe.com', 'admin')).toEqual({
      userId: '1',
      name: 'John Doe',
      email: {
        value: 'john@doe.com'
      },
      role: 'admin'
    })
  })

  test('Deve criar uma instância de um novo usuário', () => {
    expect(User.create('John Doe', 'john@doe.com', 'admin')).toEqual({
      userId: expect.any(String),
      name: 'John Doe',
      email: {
        value: 'john@doe.com'
      },
      role: 'admin'
    })
  })

  test('Não deve criar um usuário com email inválido', () => {
    expect(() => User.create('John Doe', 'johndoe.com', 'admin')).toThrow(new Error("Invalid email"))
  })
})
