import { Artist } from './Artist'

describe('Artist', () => {
  test('Deve criar um artista', () => {
    const artist = Artist.create("John Doe", "28625212050", "john@doe.com")
    expect(artist.artistId).toBeDefined()
    expect(artist.name).toBe("John Doe")
    expect(artist.cpf?.value).toBe("28625212050")
    expect(artist.email.value).toBe("john@doe.com")
  })

  test('Deve criar um artista parcial', () => {
    const artist = Artist.create(undefined, undefined, "john@doe.com")
    expect(artist.artistId).toBeDefined()
    expect(artist.name).toBeUndefined()
    expect(artist.cpf?.value).toBeUndefined()
    expect(artist.email.value).toBe("john@doe.com")
  })

  test("Não pode criar um artista com um CPF inválido", () => {
    expect(() => Artist.create("John Doe", "286212050", "john@doe.com")).toThrow(new Error("Invalid cpf"))
  })

  test("Não pode criar um artista com um email inválido", () => {
    expect(() => Artist.create("John Doe", "28625212050", "john@doecom")).toThrow(new Error("Invalid email"))
  })
})
