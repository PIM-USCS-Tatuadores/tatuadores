import { TokenGenerator } from "./TokenGenerator";

describe('TokenGenerator', () => {
  test("Deve criar um token de sessão", () => {
    const token = TokenGenerator.create({ id: 1, email: 'john@doe.com' }, "secret")
    const payload = TokenGenerator.verify(token, "secret") as any
    expect(payload.id).toBe(1)
    expect(payload.email).toBe('john@doe.com')
  })
})
