import { User } from '../../domain/User'
import { UserRepositoryMemory } from '../../infra/repository/UserRepositoryMemory'
import { Login } from './Login'

describe('Login', () => {
  test('Deve logar um usuário no sistema', async () => {
    const userRepository = new UserRepositoryMemory()
    const user = User.create('john@doe.com', '123456')
    userRepository.save(user)
    const input = {
      email: 'john@doe.com',
      password: '123456'
    }
    const usecase = new Login(userRepository)
    const output = await usecase.execute(input)
    expect(output.token).toBeDefined()
  })

  test('Deve lançar uma execeção ao falhar a autenticação', async () => {
    const userRepository = new UserRepositoryMemory()
    const user = User.create('john@doe.com', '123456')
    userRepository.save(user)
    const input = {
      email: 'john@doe.com',
      password: '1456'
    }
    const usecase = new Login(userRepository)
    await expect(() => usecase.execute(input)).rejects.toThrow(new Error('Authentication failed'))
  })
})
