import axios from 'axios'
import crypto from 'crypto'

describe('usuário', () => {
  test('Deve criar um usuário', async () => {
    const createResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    const userId = createResponse.data.userId
    const requestResponse = await axios.get(`http://localhost:3000/api/usuarios/${userId}`)
    const user = requestResponse.data
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@doe.com')
    expect(user.role).toBe('user')
  })

  test('Deve editar um usuário', async () => {
    const createResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    const userId = createResponse.data.userId
    await axios.put(`http://localhost:3000/api/usuarios/${userId}`, {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      role: 'admin'
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/usuarios/${userId}`)
    const user = requestResponse.data
    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('jane@doe.com')
    expect(user.role).toBe('admin')
  })

  test('Deve remover um usuário', async () => {
    expect.assertions(1)
    const createResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    const userId = createResponse.data.userId
    await axios.get(`http://localhost:3000/api/usuarios/${userId}`)
    await axios.delete(`http://localhost:3000/api/usuarios/${userId}`)
    try {
      await axios.get(`http://localhost:3000/api/usuarios/${userId}`)
    } catch(error: any) {
      expect(error.response.status).toBe(404)
    }
  })
})

describe('evento', () => {
  let userId: string

  beforeAll(async () => {
    const userResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    userId = userResponse.data.userId
  })

  test('Deve criar um evento ativo', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(0),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    const requestResponse = await axios.get(`http://localhost:3000/api/eventos/${eventId}`)
    const event = requestResponse.data
    expect(event.title).toBe('Flash Tattoo #1')
    expect(event.startsAt).toBe(getDateString(0))
    expect(event.endsAt).toBe(null)
    expect(event.phone).toBe('11999999999')
    expect(event.active).toBe(true)
    expect(event.userPath).toBe(`/api/usuarios/${userId}`)
    expect(event.createdAt).toBe(event.updatedAt)
  })

  test('Deve criar um evento inativo', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(1),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    const requestResponse = await axios.get(`http://localhost:3000/api/eventos/${eventId}`)
    const event = requestResponse.data
    expect(event.title).toBe('Flash Tattoo #1')
    expect(event.startsAt).toBe(getDateString(1))
    expect(event.endsAt).toBe(null)
    expect(event.phone).toBe('11999999999')
    expect(event.active).toBe(false)
    expect(event.userPath).toBe(`/api/usuarios/${userId}`)
    expect(event.createdAt).toBe(event.updatedAt)
  })

  test('Deve editar um evento', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(0),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    await axios.put(`http://localhost:3000/api/eventos/${eventId}`, {
      title: 'Flash Tattoo #2',
      startsAt: getDateString(1),
      endsAt: getDateString(7),
      phone: '11999999988',
      active: false
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/eventos/${eventId}`)
    const event = requestResponse.data
    expect(event.title).toBe('Flash Tattoo #2')
    expect(event.startsAt).toBe(getDateString(1))
    expect(event.endsAt).toBe(getDateString(7))
    expect(event.phone).toBe('11999999988')
    expect(event.active).toBe(false)
    expect(event.userPath).toBe(`/api/usuarios/${userId}`)
    expect(event.createdAt).not.toBe(event.updatedAt)
  })

  test('Deve remover um evento', async () => {
    expect.assertions(1)
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(0),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    await axios.get(`http://localhost:3000/api/eventos/${eventId}`)
    await axios.delete(`http://localhost:3000/api/eventos/${eventId}`)
    try {
      await axios.get(`http://localhost:3000/api/eventos/${eventId}`)
    } catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })

  test('Deve visualizar um evento', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(1),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    await axios.post(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`, {
      sessionId: crypto.randomUUID()
    })
    await axios.post(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`, {
      sessionId: crypto.randomUUID()
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`)
    const data = requestResponse.data
    expect(data.views).toBe(2)
    expect(data.uniqueViews).toBe(2)
  })

  test('Deve contabilizar visualizações únicas de um evento na mesma sessão', async () => {
    const sessionId = crypto.randomUUID()
    const createResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(1),
      phone: '11999999999'
    })
    const eventId = createResponse.data.eventId
    await axios.post(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`, {
      sessionId: sessionId
    })
    await axios.post(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`, {
      sessionId: sessionId
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/eventos/${eventId}/visualizacoes`)
    const data = requestResponse.data
    expect(data.views).toBe(2)
    expect(data.uniqueViews).toBe(1)
  })
})

describe('arte', () => {
  let userId: string
  let eventId: string

  beforeAll(async () => {
    const userResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    userId = userResponse.data.userId
    const eventResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(0),
      phone: '11999999999'
    })
    eventId = eventResponse.data.eventId
  })

  test('Deve criar uma arte para um evento', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    const artId = createResponse.data.artId
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}`)
    const art = requestResponse.data
    expect(art.title).toBe('Arte #1')
    expect(art.description).toBe('Descrição da arte #1')
    expect(art.price).toBe(200)
    expect(art.size).toBe(12)
    expect(art.href).toBe('http://teste.com/teste.jpg')
    expect(art.alt).toBe('Imagem da tatuagem')
    expect(art.userPath).toBe(`/api/usuarios/${userId}`)
    expect(art.eventPath).toBe(`/api/eventos/${eventId}`)
    expect(art.updatedAt).toBeDefined()
    expect(art.updatedAt).toBe(art.createdAt)
  })

  test('Deve editar uma arte para um evento', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    const artId = createResponse.data.artId
    await axios.put(`http://localhost:3000/api/artes/${artId}`, {
      title: 'Arte #2',
      description: 'Descrição da arte #2',
      price: 250,
      size: 10,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem #2'
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}`)
    const art = requestResponse.data
    expect(art.title).toBe('Arte #2')
    expect(art.description).toBe('Descrição da arte #2')
    expect(art.price).toBe(250)
    expect(art.size).toBe(10)
    expect(art.href).toBe('http://teste.com/teste.jpg')
    expect(art.alt).toBe('Imagem da tatuagem #2')
    expect(art.userPath).toBe(`/api/usuarios/${userId}`)
    expect(art.eventPath).toBe(`/api/eventos/${eventId}`)
    expect(art.updatedAt).toBeDefined()
    expect(art.updatedAt).not.toBe(art.createdAt)
  })

  test('Deve remover um arte', async () => {
    expect.assertions(1)
    const createResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    const artId = createResponse.data.artId
    await axios.get(`http://localhost:3000/api/artes/${artId}`)
    await axios.delete(`http://localhost:3000/api/artes/${artId}`)
    try {
      await axios.get(`http://localhost:3000/api/artes/${artId}`)
    } catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })

  test('Deve visualizar uma arte', async () => {
    const artResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    const artId = artResponse.data.artId
    await axios.post(`http://localhost:3000/api/artes/${artId}/visualizacoes`, {
      sessionId: crypto.randomUUID()
    })
    await axios.post(`http://localhost:3000/api/artes/${artId}/visualizacoes`, {
      sessionId: crypto.randomUUID()
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}/visualizacoes`)
    const data = requestResponse.data
    expect(data.views).toBe(2)
    expect(data.uniqueViews).toBe(2)
  })

  test('Deve contabilizar visualizações únicas de uma arte na mesma sessão', async () => {
    const sessionId = crypto.randomUUID()
    const artResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    const artId = artResponse.data.artId
    await axios.post(`http://localhost:3000/api/artes/${artId}/visualizacoes`, {
      sessionId: sessionId
    })
    await axios.post(`http://localhost:3000/api/artes/${artId}/visualizacoes`, {
      sessionId: sessionId
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}/visualizacoes`)
    const data = requestResponse.data
    expect(data.views).toBe(2)
    expect(data.uniqueViews).toBe(1)
  })
})

describe('contato', () => {
  let artId: string

  beforeAll(async () => {
    const userResponse = await axios.post('http://localhost:3000/api/usuarios', {
      name: 'John Doe',
      email: 'john@doe.com',
      role: 'user'
    })
    const userId = userResponse.data.userId
    const eventResponse = await axios.post(`http://localhost:3000/api/usuarios/${userId}/eventos`, {
      title: 'Flash Tattoo #1',
      startsAt: getDateString(0),
      phone: '11999999999'
    })
    const eventId = eventResponse.data.eventId
    const artResponse = await axios.post(`http://localhost:3000/api/eventos/${eventId}/artes`, {
      title: 'Arte #1',
      description: 'Descrição da arte #1',
      price: 200,
      size: 12,
      href: 'http://teste.com/teste.jpg',
      alt: 'Imagem da tatuagem'
    })
    artId = artResponse.data.artId
  })

  test('Deve criar um contato', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/artes/${artId}/contatos`, {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      phone: '11988887777',
      acceptContact: true
    })
    const contactId = createResponse.data.contactId
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`)
    const contact = requestResponse.data
    expect(contact.name).toBe('Jane Doe')
    expect(contact.email).toBe('jane@doe.com')
    expect(contact.phone).toBe('11988887777')
    expect(contact.acceptContact).toBe(true)
    expect(contact.artPath).toBe(`/api/artes/${artId}`)
    expect(contact.createdAt).toBeDefined()
    expect(contact.updatedAt).toBe(contact.createdAt)
  })

  test('Deve editar um contato', async () => {
    const createResponse = await axios.post(`http://localhost:3000/api/artes/${artId}/contatos`, {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      phone: '11988887777',
      acceptContact: true
    })
    const contactId = createResponse.data.contactId
    await axios.put(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`, {
      name: 'John Doe',
      email: 'joe@doe.com',
      phone: '11999999999',
      acceptContact: false
    })
    const requestResponse = await axios.get(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`)
    const contact = requestResponse.data
    expect(contact.name).toBe('John Doe')
    expect(contact.email).toBe('joe@doe.com')
    expect(contact.phone).toBe('11999999999')
    expect(contact.acceptContact).toBe(false)
    expect(contact.artPath).toBe(`/api/artes/${artId}`)
    expect(contact.createdAt).toBeDefined()
    expect(contact.updatedAt).not.toBe(contact.createdAt)
  })

  test('Deve remover um contato', async () => {
    expect.assertions(1)
    const createResponse = await axios.post(`http://localhost:3000/api/artes/${artId}/contatos`, {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      phone: '11988887777',
      acceptContact: true
    })
    const contactId = createResponse.data.contactId
    await axios.get(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`)
    await axios.delete(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`)
    try {
      await axios.get(`http://localhost:3000/api/artes/${artId}/contatos/${contactId}`)
    } catch (error: any) {
      expect(error.response.status).toBe(404)
    }
  })
})

function getDateString(offset = 0) {
  const date = new Date()
  const today = date.getDate()
  date.setDate(today + offset)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.toISOString()
}
