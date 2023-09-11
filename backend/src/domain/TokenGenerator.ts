import { sign, verify } from "jsonwebtoken";

export class TokenGenerator {
  static create(payload: any, key: string) {
    return sign(payload, key)
  }

  static verify(token: string, key: string) {
    return verify(token, key)
  }
}
