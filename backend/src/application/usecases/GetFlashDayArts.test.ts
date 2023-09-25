import { Art } from "../../domain/Art"
import { ArtRepositoryMemory } from "../../infra/repository/ArtRepositoryMemory"
import { GetFlashDayArts } from "./GetFlashDayArts"

describe('GetFlashDayArts', () => {
  test('Deve buscar todos as artes de um evento flash day', async () => {
    const repository = new ArtRepositoryMemory()
    const usecase = new GetFlashDayArts(repository)
    const artPayload1 = {
      title: 'Título da Arte #1',
      description: 'Descrição da arte',
      price: 300,
      size: 12,
      href: 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg',
      altText: 'imagem de um leão'
    }
    const artPayload2 = {
      title: 'Título da Arte #2',
      description: 'Descrição da arte',
      price: 250,
      size: 13,
      href: 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg',
      altText: 'imagem de um leão'
    }
    const flashDayId = '12345'
    repository.save(Art.create(artPayload1.title, artPayload1.description, artPayload1.price, artPayload1.size, artPayload1.href, artPayload1.altText), flashDayId)
    repository.save(Art.create(artPayload2.title, artPayload2.description, artPayload2.price, artPayload2.size, artPayload2.href, artPayload2.altText), flashDayId)
    const output = await usecase.execute({ flashDayId })
    expect(output).toEqual([
      {
        id: expect.any(String),
        title: 'Título da Arte #1',
        description: 'Descrição da arte',
        price: 300,
        size: 12,
        href: 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg',
        altText: 'imagem de um leão'
      },
      {
        id: expect.any(String),
        title: 'Título da Arte #2',
        description: 'Descrição da arte',
        price: 250,
        size: 13,
        href: 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg',
        altText: 'imagem de um leão'
      }
    ])
  })
})
