import axios from 'axios'
import { listen } from './app'

let close: any

beforeAll(() => {
  close = listen(3000)
})

afterAll((done) => close(done))

test('Deve registrar um novo artista', async () => {
  const [artistId] = await login("john@doe.com", "123456")
  const artistResponse = await axios.get(`http://localhost:3000/api/v1/artists/${artistId}`)
  const artist = artistResponse.data
  expect(artist.email).toBe('john@doe.com')
  expect(artist.name).toBeFalsy()
  expect(artist.document).toBeFalsy()
})

test('Deve logar no sistema', async () => {
  const [, tokenCookie] = await login("john1@doe.com", "123456")
  const userResponse = await axios.get('http://localhost:3000/api/v1/current_user', {
    headers: {
      'Cookie': tokenCookie
    }
  })
  const user = userResponse.data
  expect(user.id).toEqual(expect.any(String))
  expect(user.email).toBe('john1@doe.com')
  expect(user.name).toBeFalsy()
  expect(user.document).toBeFalsy()
})

test('Deve retornar um token vazio para um usuário inexistente', async () => {
  try {
    await axios.get('http://localhost:3000/api/v1/current_user', {
      headers: {
        'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1NiIsImlhdCI6MTY5NDQ1ODgxNH0.jDq8NoICfAVQki6uvqAVvRL7flDO3qp2iTgcEuKJ-2E; Path=/'
      }
    })
  } catch (error: any) {
    const headers = error.response.headers
    expect(error.response.status).toBe(403)
    expect(headers['set-cookie']).toEqual(['token=; Path=/'])
  }
})

test('Deve criar um evento flash day', async () => {
  const [, tokenCookie] = await login("john2@doe.com", "123456")
  const createResponse = await axios.post(`http://localhost:3000/api/v1/flash_days`, {
    title: 'Flash Tattoo #1',
    startsAt: (new Date(2023, 10, 12)).toISOString(),
    endsAt: undefined,
    phone: '11949729444',
    active: true
  }, {
    headers: {
      'Cookie': tokenCookie
    }
  })
  const flashDayId = createResponse.data.flash_day_id
  const flashDayResponse = await axios.get(`http://localhost:3000/api/v1/flash_days/${flashDayId}`)
  const flashDay = flashDayResponse.data
  expect(flashDay.id).toBe(flashDayId)
  expect(flashDay.title).toBe('Flash Tattoo #1')
  expect(flashDay.starts_at).toBe((new Date(2023, 10, 12)).toISOString())
  expect(flashDay.ends_at).toBe(undefined)
  expect(flashDay.phone).toBe('11949729444')
  expect(flashDay.active).toBe(true)
})

test('Deve editar um evento flash day', async () => {
  const [, tokenCookie] = await login("jane@doe.com", "123456")
  const createResponse = await axios.post(`http://localhost:3000/api/v1/flash_days`, {
    title: 'Flash Tattoo #2',
    startsAt: (new Date(2023, 10, 15)).toISOString(),
    endsAt: undefined,
    phone: '11949729444',
    active: true
  }, {
    headers: {
      'Cookie': tokenCookie
    }
  })
  const flashDayId = createResponse.data.flash_day_id
  await axios.patch(`http://localhost:3000/api/v1/flash_days/${flashDayId}`, {
    title: 'Flash Tattoo #6',
    phone: '11999999999',
    active: false
  }, {
    headers: {
      'Cookie': tokenCookie
    }
  })
  const flashDayResponse = await axios.get(`http://localhost:3000/api/v1/flash_days/${flashDayId}`)
  const flashDay = flashDayResponse.data
  expect(flashDay.id).toBe(flashDayId)
  expect(flashDay.title).toBe('Flash Tattoo #6')
  expect(flashDay.starts_at).toBe((new Date(2023, 10, 15)).toISOString())
  expect(flashDay.ends_at).toBe(undefined)
  expect(flashDay.phone).toBe('11999999999')
  expect(flashDay.active).toBe(false)
})

test('Deve falhar ao criar um evento flash day sem autenticação', async () => {
  try {
    await axios.post(`http://localhost:3000/api/v1/flash_days`, {
      title: 'Flash Tattoo #1',
      startsAt: (new Date(2023, 10, 12)).toISOString(),
      endsAt: undefined,
      phone: '11949729444',
      active: true
    })
  } catch(error: any) {
    expect(error.response.status).toBe(401)
  }
})

test('Deve trazer todos os eventos flash days de um usuário', async () => {
  const [artistId, tokenCookie] = await login("john4@doe.com", "123456")
  await axios.post(`http://localhost:3000/api/v1/flash_days`, {
    title: 'Flash Tattoo #1',
    startsAt: (new Date(2023, 10, 12)).toISOString(),
    endsAt: undefined,
    phone: '11949729444',
    active: true
  }, {
    headers: {
      'Cookie': tokenCookie
    }
  })
  await axios.post(`http://localhost:3000/api/v1/flash_days`, {
    title: 'Flash Tattoo #2',
    startsAt: (new Date(2023, 10, 15)).toISOString(),
    endsAt: undefined,
    phone: '11949729444',
    active: false
  }, {
    headers: {
      'Cookie': tokenCookie
    }
  })
  const flashDaysResponse = await axios.get(`http://localhost:3000/api/v1/artists/${artistId}/flash_days`)
  const flashDays = flashDaysResponse.data
  expect(flashDays).toHaveLength(2)
  expect(flashDays).toEqual([
    {
      id: expect.any(String),
      title: 'Flash Tattoo #1',
      starts_at: (new Date(2023, 10, 12)).toISOString(),
      phone: '11949729444',
      active: true
    },
    {
      id: expect.any(String),
      title: 'Flash Tattoo #2',
      starts_at: (new Date(2023, 10, 15)).toISOString(),
      phone: '11949729444',
      active: false
    }
  ])
})

async function login(email: string, password: string) {
  const registerResponse = await axios.post('http://localhost:3000/api/v1/artists/register', {
    email,
    password
  })
  const artistId = registerResponse.data.artist_id
  const loginResponse = await axios.post('http://localhost:3000/api/v1/login', {
    email,
    password
  })
  const tokenCookie = loginResponse.headers['set-cookie']?.[0] as string
  return [artistId, tokenCookie]
}
