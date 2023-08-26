import { User } from "../../../domain/user"
import { UserRepositoryMemory } from "../../../infra/repository/user-repository-memory"
import { GetUser } from "./get-user"

describe('GetUser', () => {
  test('Deve retornar um usuário', async () => {
    const user = User.create('John Doe', 'john@doe.com', 'admin')
    const repository = new UserRepositoryMemory()
    repository.save(user)
    const usecase = new GetUser(repository)
    await expect(usecase.execute({ userId: user.userId })).resolves.toEqual({
      userId: user.userId,
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'admin'
    })
  })

  test('Não deve retornar um usuário se não existir', async () => {
    const repository = new UserRepositoryMemory()
    const usecase = new GetUser(repository)
    await expect(usecase.execute({ userId: '1' })).resolves.toBeUndefined()
  })
})
