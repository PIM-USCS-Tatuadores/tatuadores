import { IUserRepository } from '../../repository/user-repository'

export class GetUser {
  constructor (readonly userRespository: UserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput | undefined> {
    const userId = input.userId

    try {
      const user = await this.userRespository.get(userId)
      return {
        userId: user.userId,
        name: user.name,
        email: user.email.value,
        role: user.role
      }
    } catch (error: any) {
      return
    }
  }
}

type UserRepository = Pick<IUserRepository, 'get'>

type GetUserInput = {
  userId: string
}

type GetUserOutput = {
  userId: string,
  name: string,
  email: string,
  role: string
}
