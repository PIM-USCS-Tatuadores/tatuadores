import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { Request, Response, NextFunction } from 'express'
import { config } from './environment'
import { PgPromiseAdapter } from './infra/database/pg-promise-adapter'
import { UserRepositoryDatabase } from './infra/repository/UserRepositoryDatabase'
import { ArtistRepositoryDatabase } from './infra/repository/ArtistRepositoryDatabase'
import { ArtRepositoryDatabase } from './infra/repository/ArtRepostoryDatabase'
import { RegisterArtist } from './application/usecases/RegisterArtist'
import { GetArtist } from './application/usecases/GetArtist'
import { Login } from './application/usecases/Login'
import { CreateFlashDay } from './application/usecases/CreateFlashDay'
import { FlashDayRepositoryDatabase } from './infra/repository/FlashDayRepositoryDatabase'
import { TokenGenerator } from './domain/TokenGenerator'
import { GetFlashDay } from './application/usecases/GetFlashDay'
import { GetArtistFlashDays } from './application/usecases/GetArtistFlashDays'
import { UpdateFlashDay } from './application/usecases/UpdateFlashDay'
import { CreateArt } from './application/usecases/CreateArt'
import { GetArt } from './application/usecases/GetArt'
import { GetFlashDayArts } from './application/usecases/GetFlashDayArts'
import { UpdateArt } from './application/usecases/UpdateArt'
import { CreateContact } from './application/usecases/CreateContact'
import { ContactRepositoryDatabase } from './infra/repository/ContactRepositoryDatabase'
import { GetFlashDayContacts } from './application/usecases/GetFlashDayContacts'

config(process.env.NODE_ENV)
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const connection = new PgPromiseAdapter()
const userRepository = new UserRepositoryDatabase(connection)
const artistRepository = new ArtistRepositoryDatabase(connection)
const flashDayRepository = new FlashDayRepositoryDatabase(connection)
const artRepository = new ArtRepositoryDatabase(connection)
const contactRepository = new ContactRepositoryDatabase(connection)

app.post('/api/v1/artists/register', async (req, res) => {
  try {
    const usecase = new RegisterArtist(userRepository, artistRepository)
    const output = await usecase.execute({ ...req.body })
    res.status(201).json({
      artist_id: output.artistId
    })
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    })
  }
})

app.post('/api/v1/login', async (req, res) => {
  const usecase = new Login(userRepository)
  try {
    const output = await usecase.execute({ ...req.body })
    res.cookie('token', output.token, {
      httpOnly: false,
      secure: false
    })
    res.status(200)
    res.json({})
  } catch (error: any) {
    res.status(403).json({
      message: error.message
    })
  }
})

app.get('/api/v1/current_user', withAuthMiddleware, async (req, res) => {
  const artistId = req.user.userId
  const usecase = new GetArtist(artistRepository)
  try {
    const output = await usecase.execute({ artistId })
    res.status(200)
    res.json({
      id: output?.artistId,
      name: output?.name,
      email: output?.email,
      document: output?.document
    })
  } catch (error: any) {
    res.cookie('token', '')
    res.status(403)
    res.json({})
  }
})

app.get('/api/v1/artists/:artistId', async (req, res) => {
  const artistId = req.params.artistId
  const usecase = new GetArtist(artistRepository)
  try {
    const output = await usecase.execute({ artistId })
    if (!output) {
      res.status(404).json({
        message: 'Artist not found'
      })
    } else {
      res.status(200).json({
        id: output?.artistId,
        name: output.name,
        email: output.email,
        document: output.document
      })
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.get('/api/v1/artists/:artistId/flash_days', async (req, res) => {
  const artistId = req.params.artistId
  const usecase = new GetArtistFlashDays(flashDayRepository)
  try {
    const output = await usecase.execute({ artistId })
    const payload = output.map(data => ({
      id: data?.flashDayId,
      title: data?.title,
      starts_at: data?.startsAt,
      ends_at: data?.endsAt,
      phone: data?.phone,
      active: data?.active
    }))
    res.status(200).json(payload)
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.post('/api/v1/flash_days', withAuthMiddleware, async (req, res) => {
  try {
    const artistId = req.user.userId
    const usecase = new CreateFlashDay(flashDayRepository)
    const output = await usecase.execute({
      title: req.body.title,
      startsAt: req.body.starts_at,
      endsAt: req.body.ends_at,
      phone: req.body.phone,
      active: req.body.active,
      artistId
    })
    res.status(201).json({
      flash_day_id: output.flashDayId
    })
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    })
  }
})

app.patch('/api/v1/flash_days/:flashDayId', withAuthMiddleware, async (req, res) => {
  try {
    const flashDayId = req.params.flashDayId
    const artistId = req.user.userId
    const usecase = new UpdateFlashDay(flashDayRepository)
    const output = await usecase.execute({
      title: req.body.title,
      startsAt: req.body.starts_at,
      endsAt: req.body.ends_at,
      phone: req.body.phone,
      active: req.body.active,
      flashDayId,
      artistId
    })
    res.status(200).json({
      flash_day_id: output.flashDayId
    })
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    })
  }
})

app.get('/api/v1/flash_days/:flashDayId', async (req, res) => {
  try {
    const flashDayId = req.params.flashDayId
    const usecase = new GetFlashDay(flashDayRepository)
    const output = await usecase.execute({ flashDayId })
    if (!output) {
      res.status(404).json({
        message: 'Flash day not found'
      })
    } else {
      res.status(200).json({
        id: output.flashDayId,
        title: output.title,
        starts_at: output.startsAt,
        ends_at: output.endsAt,
        phone: output.phone,
        active: output.active,
        artist_id: output.artistId
      })
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.post('/api/v1/flash_days/:flashDayId/arts', withAuthMiddleware, async (req, res) => {
  try {
    const flashDayId = req.params.flashDayId
    const artistId = req.user.userId
    const usecase = new CreateArt(artRepository)
    const output = await usecase.execute({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      size: req.body.size,
      href: req.body.href,
      altText: req.body.alt,
      flashDayId,
      artistId
    })
    res.status(201).json({
      art_id: output.artId
    })
  } catch (error: any) {
    console.log(error.message)
    res.status(422).json({
      message: error.message
    })
  }
})

app.get('/api/v1/flash_days/:flashDayId/arts', async (req, res) => {
  try {
    const flashDayId = req.params.flashDayId
    const usecase = new GetFlashDayArts(artRepository)
    const output = await usecase.execute({ flashDayId })
    res.status(200).json(output.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      size: item.size,
      href: item.href,
      alt_text: item.altText
    })))
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.get('/api/v1/flash_days/:flashDayId/contacts', withAuthMiddleware, async (req, res) => {
  try {
    const flashDayId = req.params.flashDayId
    const artistId = req.user.userId
    const usecase = new GetFlashDayContacts(contactRepository)
    const output = await usecase.execute({ flashDayId, artistId })
    res.status(200).json(output.map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      accept_contact: contact.acceptContact
    })))
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.get('/api/v1/arts/:artId', async (req, res) => {
  try {
    const artId = req.params.artId
    const usecase = new GetArt(artRepository)
    const output = await usecase.execute({ artId })
    if (!output) {
      return res.status(404).json({
        message: 'Art not found'
      })
    }
    return res.status(200).json({
      id: output.artId,
      title: output.title,
      description: output.description,
      price: output.price,
      size: output.size,
      href: output.href,
      alt_text: output.altText,
      flash_day_id: output.flashDayId
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
})

app.patch('/api/v1/arts/:artId', withAuthMiddleware, async (req, res) => {
  try {
    const artId = req.params.artId
    const artistId = req.user.userId
    const usecase = new UpdateArt(artRepository)
    const output = await usecase.execute({
      artId,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      size: req.body.size,
      href: req.body.href,
      altText: req.body.alt,
      artistId
    })
    res.status(200).json({
      art_id: output.artId
    })
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    })
  }
})

app.post('/api/v1/arts/:artId/contacts', async (req, res) => {
  try {
    const artId = req.params.artId
    const usecase = new CreateContact(contactRepository)
    const output = await usecase.execute({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      acceptContact: req.body.accept_contact,
      artId
    })
    res.status(201).json({
      contact_id: output.contactId
    })
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    })
  }
})

function withAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.token
  if (!accessToken) {
    return res.status(401).json({
      message: 'Not Authorized'
    })
  }
  try {
    const response = TokenGenerator.verify(accessToken, "secret")
    req.user = response
    next()
  } catch (error: any) {
    res.status(403).json({
      message: 'Forbidden'
    })
  }
}

export function listen(port: string | number, fn?: () => void) {
  const server = app.listen(port, fn)

  return function close(fn?: () => void) {
    server.close(async () => {
      await connection.close()
      fn?.()
    })
  }
}
