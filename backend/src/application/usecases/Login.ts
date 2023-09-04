import { TokenGenerator } from "../../domain/TokenGenerator";
import { IUserRepository } from "../repository/UserRepository";

export class Login {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.getByEmail(input.email)
    if (user?.validatePassword(input.password)) {
      const token = TokenGenerator.create({
        userId: user.userId,
        email: user.email.value
      }, "secret")
      return { token }
    }
    throw new Error('Authentication failed')
  }
}

type LoginInput = {
  email: string,
  password: string
}

type LoginOutput = {
  token: string
}
