import crypto from "crypto"
import Cpf from "./Cpf";
import { Email } from "./Email";

export class Artist {
  cpf: Cpf | undefined
  email: Email

  constructor(
    readonly artistId: string,
    readonly name: string | undefined,
    cpf: string | undefined,
    email: string
  ) {
    if (cpf) this.cpf = new Cpf(cpf)
    this.email = new Email(email)
  }

  static create(name: string | undefined, cpf: string | undefined, email: string) {
    const id = crypto.randomUUID()
    return new Artist(id, name, cpf, email)
  }
}
