import { User } from '../../../domain/user'
import { IUserRepository } from '../../repository/user-repository'

export class CreateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = User.create(input.name, input.email, input.role)
    await this.userRepository.save(user)
    return { userId: user.userId }
  }
}

type UserRepository = Pick<IUserRepository, 'save'>

type CreateUserInput = {
  name: string,
  email: string,
  role: string
}

type CreateUserOutput = {
  userId: string
}
