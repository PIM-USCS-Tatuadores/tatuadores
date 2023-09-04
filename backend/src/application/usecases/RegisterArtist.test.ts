import { RegisterArtist } from "./RegisterArtist";
import { UserRepositoryMemory } from "../../infra/repository/UserRepositoryMemory";
import { ArtistRepositoryMemory } from "../../infra/repository/ArtistRepositoryMemory";

describe('RegisterArtistUseCase', () => {
  test('Deve registrar um artista', async () => {
    const usecase = new RegisterArtist(
      new UserRepositoryMemory(),
      new ArtistRepositoryMemory()
    )
    const input = {
      email: 'john@doe.com',
      password: '123456'
    }
    const output = await usecase.execute(input)
    expect(output.artistId).toEqual(expect.any(String))
  })
})
