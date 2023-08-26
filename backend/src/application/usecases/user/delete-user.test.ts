import { User } from '../../../domain/user'
import { UserRepositoryMemory } from '../../../infra/repository/user-repository-memory'
import { DeleteUser } from './delete-user'

describe('DeleteUser', () => {
  test('Deve deletar um usuário', async () => {
    const repository = new UserRepositoryMemory()
    const usecase = new DeleteUser(repository)
    const user = User.create('John Doe', 'john@doe.com', 'admin')
    await repository.save(user)
    usecase.execute({ userId: user.userId })
    await expect(repository.get(user.userId)).resolves.toBeUndefined()
  })
})
