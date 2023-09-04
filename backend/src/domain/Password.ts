import bcrypt from 'bcryptjs'

export class Password {
  constructor(readonly value: string) {}

  static create(password: string) {
    const salt = bcrypt.genSaltSync()
    return new Password(bcrypt.hashSync(password, salt))
  }

  validate(password: string) {
    return bcrypt.compareSync(password, this.value)
  }
}
