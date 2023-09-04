import { Artist } from "../../domain/Artist"
import { ArtistRepositoryMemory } from "../../infra/repository/ArtistRepositoryMemory"
import { GetArtist } from "./GetArtist"

describe('GetArtist', () => {
  test('Deve buscar um artista na base de dados', async () => {
    const artistRepository = new ArtistRepositoryMemory()
    const artist = Artist.create("john doe", "83432616074", "john@doe.com")
    artistRepository.save(artist)
    const usecase = new GetArtist(artistRepository)
    const output = await usecase.execute({ artistId: artist.artistId })
    expect(output?.artistId).toBe(artist.artistId)
    expect(output?.name).toBe('john doe')
    expect(output?.document).toBe('83432616074')
    expect(output?.email).toBe('john@doe.com')
  })
})
