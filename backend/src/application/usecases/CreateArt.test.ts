import { ArtRepositoryMemory } from "../../infra/repository/ArtRepositoryMemory"
import { CreateArt } from "./CreateArt"

describe('CreateArt', () => {
  test('Deve criar uma arte para um evento flash day', async () => {
    const artRepository = new ArtRepositoryMemory()
    const usecase = new CreateArt(artRepository)
    const input = {
      title: 'Titulo da Arte #1',
      description: undefined,
      price: 300,
      size: 12,
      href: 'http://test.com/test.jpg',
      altText: undefined,
      flashDayId: '12345',
      artistId: '123456'
    }
    const output = await usecase.execute(input)
    expect(output.artId).toBeDefined()
  })
})
