import { User } from "../../../domain/user"
import { UserRepositoryMemory } from "../../../infra/repository/user-repository-memory"
import { UpdateUser } from "./update-user"

describe('UpdateUser', () => {
  test('Deve editar um usuário', async () => {
    const repository = new UserRepositoryMemory()
    const usecase = new UpdateUser(repository)
    const user = User.create('John Doe', 'john@doe.com', 'admin')
    await repository.save(user)
    await usecase.execute({
      userId: user.userId,
      name: 'Jane Doe',
      email: 'jane@doe.com',
      role: 'user'
    })
    const editedUser = await repository.get(user.userId)
    expect(editedUser).toEqual({
      userId: user.userId,
      name: 'Jane Doe',
      email: {
        value: 'jane@doe.com'
      },
      role: 'user'
    })
  })
})
