import { Art } from "../../domain/Art"
import { ArtRepositoryMemory } from "../../infra/repository/ArtRepositoryMemory"
import { UpdateArt } from "./UpdateArt"

describe('UpdateArt', () => {
  test('Deve atualizar uma arte', async () => {
    const artRepository = new ArtRepositoryMemory()
    const artId = '123456'
    const flashdayId = '123456'
    const artistId = '123456'
    const href = 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg'
    const art = new Art(artId, 'Título da Arte #1', undefined, 300, 12, href, undefined)
    artRepository.save(art, flashdayId)
    const usecase = new UpdateArt(artRepository)
    await usecase.execute({
      artId,
      title: 'Título da Arte #2',
      description: 'Descrição da Arte',
      price: 320,
      size: 13,
      href,
      altText: 'Foto da tatuagem',
      artistId
    })
    const updatedArt = await artRepository.get(artId)
    expect(updatedArt.title).toBe('Título da Arte #2')
    expect(updatedArt.description).toBe('Descrição da Arte')
    expect(updatedArt.price).toBe(320)
    expect(updatedArt.size).toBe(13)
    expect(updatedArt.href).toBe(href)
    expect(updatedArt.altText).toBe('Foto da tatuagem')
  })

  test('Deve atualizar apenas alguns dados de uma arte', async () => {
    const artRepository = new ArtRepositoryMemory()
    const artId = '123456'
    const flashdayId = '123456'
    const artistId = '123456'
    const href = 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg'
    const art = new Art(artId, 'Título da Arte #1', undefined, 300, 12, href, undefined)
    artRepository.save(art, flashdayId)
    const usecase = new UpdateArt(artRepository)
    await usecase.execute({
      artId,
      description: 'Descrição da Arte',
      price: 320,
      artistId
    })
    const updatedArt = await artRepository.get(artId)
    expect(updatedArt.title).toBe('Título da Arte #1')
    expect(updatedArt.description).toBe('Descrição da Arte')
    expect(updatedArt.price).toBe(320)
    expect(updatedArt.size).toBe(12)
    expect(updatedArt.href).toBe(href)
    expect(updatedArt.altText).toBe(undefined)
  })
})
