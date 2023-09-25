import { Art } from "./Art"

describe('Art', () => {
  test('Deve criar um flash day', () => {
    const href = 'https://cdn.awsli.com.br/600x1000/779/779540/produto/1562181402876970705.jpg'
    const art = Art.create('Título da arte #1', 'Descrição da arte', 300, 12, href, 'imagem de um leão')
    expect(art.artId).toBeDefined()
    expect(art.title).toBe('Título da arte #1')
    expect(art.description).toBe('Descrição da arte')
    expect(art.price).toBe(300)
    expect(art.size).toBe(12)
    expect(art.href).toBe(href)
    expect(art.altText).toBe('imagem de um leão')
  })
})
