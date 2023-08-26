import { User } from '../../../domain/user'
import { IUserRepository } from '../../repository/user-repository'

export class UpdateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const userId = input.userId
    const user = new User(userId, input.name, input.email, input.role)
    await this.userRepository.update(user)
    return { userId }
  }
}

type UserRepository = Pick<IUserRepository, 'update'>

type UpdateUserInput = {
  userId: string,
  name: string,
  email: string,
  role: string
}

type UpdateUserOutput = {
  userId: string
}
