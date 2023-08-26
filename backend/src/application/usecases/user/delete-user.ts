import { IUserRepository } from "../../repository/user-repository";

export class DeleteUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    await this.userRepository.delete(input.userId)
  }
}

type UserRepository = Pick<IUserRepository, 'delete'>

type DeleteUserInput = {
  userId: string
}
