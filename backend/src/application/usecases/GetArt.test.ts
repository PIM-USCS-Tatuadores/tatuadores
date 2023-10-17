import { Art } from "../../domain/Art"
import { ArtRepositoryMemory } from "../../infra/repository/ArtRepositoryMemory"
import { GetArt } from "./GetArt"

describe('CreateFlashDay', () => {
  test('Deve buscar um evento flash day', async () => {
    const repository = new ArtRepositoryMemory()
    const artPayload = {
      title: 'Título da Arte #1',
      description: 'Descrição da arte',
      price: 300,
      size: 12,
      href: 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg',
      altText: 'imagem de um leão'
    }
    const flashDayId = '12345'
    const art = Art.create(artPayload.title, artPayload.description, artPayload.price, artPayload.size, artPayload.href, artPayload.altText)
    await repository.save(art, flashDayId)
    const usecase = new GetArt(repository)
    const input = { artId: art.artId }
    const output = await usecase.execute(input)
    expect(output?.artId).toBe(art.artId)
    expect(output?.title).toBe(artPayload.title)
    expect(output?.description).toBe(artPayload.description)
    expect(output?.price).toBe(artPayload.price)
    expect(output?.size).toBe(artPayload.size)
    expect(output?.href).toBe(artPayload.href)
    expect(output?.altText).toBe(artPayload.altText)
    expect(output?.flashDayId).toBe(flashDayId)
  })
})
