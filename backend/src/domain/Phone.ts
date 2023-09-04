export class Phone {
  constructor(readonly value: string) {
    if (!this.validate(value))
      throw new Error("Invalid phone number")
  }

  validate(value: string) {
    return String(value).match(/^(\+[1-9]{2,3})?([1-9]{2})(9[1-9]{4})([1-9]{4})$/)
  }
}
