import { UserRepositoryMemory } from "../../../infra/repository/user-repository-memory"
import { CreateUser } from "./create-user"

describe('CreateUser', () => {
  test('Deve criar um usuário', async () => {
    const repository = new UserRepositoryMemory()
    const usecase = new CreateUser(repository)
    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    }
    const { userId } = await usecase.execute(input)
    const user = await repository.get(userId)
    expect(user).toEqual({
      userId: userId,
      name: 'John Doe',
      email: {
        value: 'john@doe.com'
      },
      role: 'user'
    })
  })
})
