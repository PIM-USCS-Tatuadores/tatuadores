import express from 'express'
import crypto from 'crypto'
import { UserRepositoryDatabase } from './infra/repository/user-repository-database'
import { CreateUser } from './application/usecases/user/create-user'
import { UpdateUser } from './application/usecases/user/update-user'
import { GetUser } from './application/usecases/user/get-user'
import { DeleteUser } from './application/usecases/user/delete-user'
import { PgPromiseAdapter } from './infra/database/PgPromiseAdapter'

const app = express()
app.use(express.json())
const connection = new PgPromiseAdapter()
const userRespository = new UserRepositoryDatabase(connection)

app.post('/api/usuarios', async function (req, res) {
  try {
    const usecase = new CreateUser(userRespository)
    const output = await usecase.execute(req.body)
    res.status(201).json(output)
  } catch(error: any) {
    res.status(422).send(error.message)
  }
})

app.put('/api/usuarios/:userId', async function (req, res) {
  try {
    const usecase = new UpdateUser(userRespository)
    const output = await usecase.execute({
      userId: req.params.userId,
      ...req.body
    })
    res.status(200).json(output)
  } catch (error: any) {
    res.status(422).send(error.message)
  }
})

app.get('/api/usuarios/:userId', async function (req, res) {
  try {
    const usecase = new GetUser(userRespository)
    const userData = await usecase.execute({ userId: req.params.userId })
    if (userData) {
      res.status(200).json(userData)
    } else {
      res.status(404).end()
    }
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

app.delete('/api/usuarios/:userId', async function (req, res) {
  const userId = req.params.userId
  const usecase = new DeleteUser(userRespository)
  try {
    await usecase.execute({ userId })
    res.status(200).end()
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

app.post('/api/usuarios/:userId/eventos', async function (req, res) {
  const eventId = crypto.randomUUID()
  const userId = req.params.userId
  const active = new Date() >= new Date(req.body.startsAt)
  await connection.query('INSERT INTO tattoo.event (id, user_id, title, starts_at, ends_at, phone, active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)', [eventId, userId, req.body.title, req.body.startsAt, req.body.endsAt, req.body.phone, active, new Date()])
  res.status(201).json({ eventId })
})

app.put('/api/eventos/:eventId', async function (req, res) {
  const eventId = req.params.eventId
  await connection.query('UPDATE tattoo.event SET title = $1, starts_at = $2, ends_at = $3, phone = $4, active = $5, updated_at = $6 WHERE id = $7', [req.body.title, req.body.startsAt, req.body.endsAt, req.body.phone, req.body.active, new Date(), eventId])
  res.status(200).json({ eventId })
})

app.delete('/api/eventos/:eventId', async function (req, res) {
  const eventId = req.params.eventId
  await connection.query('UPDATE tattoo.event SET deleted_at = $1 WHERE id = $2', [new Date(), eventId])
  res.status(200).end()
})

app.get('/api/eventos/:eventId', async function (req, res) {
  const eventId = req.params.eventId
  const [eventData] = await connection.query('SELECT id, user_id, title, starts_at, ends_at, phone, active, created_at, updated_at FROM tattoo.event WHERE id = $1 AND deleted_at IS NULL', [eventId])
  if (eventData) {
    res.json({
      id: eventData.id,
      title: eventData.title,
      startsAt: eventData.starts_at,
      endsAt: eventData.ends_at,
      phone: eventData.phone,
      active: JSON.parse(eventData.active),
      userPath: `/api/usuarios/${eventData.user_id}`,
      createdAt: eventData.created_at,
      updatedAt: eventData.updated_at
    })
  } else {
    res.status(404).end()
  }
})

app.post('/api/eventos/:eventId/visualizacoes', async function (req, res) {
  const viewId = crypto.randomUUID()
  const eventId = req.params.eventId
  const sessionId = req.body.sessionId
  await connection.query('INSERT INTO tattoo.eventview (id, event_id, session_id, created_at) VALUES ($1, $2, $3, $4)', [viewId, eventId, sessionId, new Date()])
  res.status(201).json({ eventViewId: viewId })
})

app.get('/api/eventos/:eventId/visualizacoes', async function (req, res) {
  const eventId = req.params.eventId
  const [viewData] = await connection.query('SELECT count(*) as views, count(distinct session_id) as unique_views FROM tattoo.eventview WHERE event_id = $1', [eventId])
  res.json({
    views: parseInt(viewData.views, 10),
    uniqueViews: parseInt(viewData.unique_views, 10)
  })
})

app.post('/api/eventos/:eventId/artes', async function (req, res) {
  const artId = crypto.randomUUID()
  const imageId = btoa(req.body.href)
  const eventId = req.params.eventId
  await connection.transaction(async transaction => {
    await transaction.query('INSERT INTO tattoo.image (id, href, alt_text, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) ON CONFLICT (id) DO UPDATE SET alt_text = $3, updated_at = $4', [imageId, req.body.href, req.body.alt, new Date()])
    await transaction.query('INSERT INTO tattoo.art (id, event_id, image_id, title, description, price, size, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)', [artId, eventId, imageId, req.body.title, req.body.description, req.body.price, req.body.size, new Date()])
  })
  res.status(201).json({ artId })
})

app.put('/api/artes/:artId', async function (req, res) {
  const artId = req.params.artId
  const imageId = btoa(req.body.href)
  await connection.transaction(async transaction => {
    await transaction.query('INSERT INTO tattoo.image (id, href, alt_text, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) ON CONFLICT (id) DO UPDATE SET alt_text = $3, updated_at = $4', [imageId, req.body.href, req.body.alt, new Date()])
    await transaction.query('UPDATE tattoo.art SET image_id = $1, title = $2, description = $3, price = $4, size = $5, updated_at = $6 WHERE id = $7', [imageId, req.body.title, req.body.description, req.body.price, req.body.size, new Date(), artId])
  })
  res.status(200).json({ artId })
})

app.delete('/api/artes/:artId', async function (req, res) {
  const artId = req.params.artId
  await connection.query('UPDATE tattoo.art SET deleted_at = $1 WHERE id = $2', [new Date(), artId])
  res.status(200).end()
})

app.get('/api/artes/:artId', async function (req, res) {
  const artId = req.params.artId
  const [artData] = await connection.query(`
  SELECT a.id, a.event_id, e.user_id, a.title, a.description, a.price, a.size, i.href, i.alt_text, a.created_at, a.updated_at
  FROM tattoo.art a
  INNER JOIN tattoo.image i ON i.id = a.image_id
  INNER JOIN tattoo.event e ON a.event_id = e.id WHERE a.id = $1 AND a.deleted_at IS NULL
  `, [artId])
  if (artData) {
    res.json({
      id: artData.id,
      title: artData.title,
      description: artData.description,
      price: parseFloat(artData.price),
      size: parseFloat(artData.size),
      href: artData.href,
      alt: artData.alt_text,
      userPath: `/api/usuarios/${artData.user_id}`,
      eventPath: `/api/eventos/${artData.event_id}`,
      createdAt: artData.created_at,
      updatedAt: artData.updated_at
    })
  } else {
    res.status(404).end()
  }
})

app.post('/api/artes/:artId/visualizacoes', async function (req, res) {
  const viewId = crypto.randomUUID()
  const artId = req.params.artId
  const sessionId = req.body.sessionId
  await connection.query('INSERT INTO tattoo.artview (id, art_id, session_id, created_at) VALUES ($1, $2, $3, $4)', [viewId, artId, sessionId, new Date()])
  res.status(201).json({ artViewId: viewId })
})

app.get('/api/artes/:artId/visualizacoes', async function (req, res) {
  const artId = req.params.artId
  const [viewData] = await connection.query('SELECT count(*) as views, count(distinct session_id) as unique_views FROM tattoo.artview WHERE art_id = $1', [artId])
  res.json({
    views: parseInt(viewData.views, 10),
    uniqueViews: parseInt(viewData.unique_views, 10)
  })
})

app.post('/api/artes/:artId/contatos', async function (req, res) {
  const contactId = crypto.randomUUID()
  const artId = req.params.artId
  await connection.query('INSERT INTO tattoo.contact (id, art_id, name, email, phone, accept_contact, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)', [contactId, artId, req.body.name, req.body.email, req.body.phone, req.body.acceptContact, new Date()])
  res.status(201).json({ contactId })
})

app.put('/api/artes/:artId/contatos/:contactId', async function(req, res) {
  const artId = req.params.artId
  const contactId = req.params.contactId
  await connection.query('UPDATE tattoo.contact SET name = $1, email = $2, phone = $3, accept_contact = $4, updated_at = $5 WHERE id = $6 AND art_id = $7', [req.body.name, req.body.email, req.body.phone, req.body.acceptContact, new Date(), contactId, artId])
  res.status(200).json({ contactId })
})

app.delete('/api/artes/:artId/contatos/:contactId', async function(req, res) {
  const artId = req.params.artId
  const contactId = req.params.contactId
  await connection.query('UPDATE tattoo.contact SET deleted_at = $1 WHERE id = $2 AND art_id = $3', [new Date(), contactId, artId])
  res.status(200).end()
})

app.get('/api/artes/:artId/contatos/:contactId', async function (req, res) {
  const artId = req.params.artId
  const contactId = req.params.contactId
  const [contactData] = await connection.query(`
  SELECT name, email, phone, accept_contact, art_id, created_at, updated_at
  FROM tattoo.contact WHERE id = $1 AND art_id = $2 AND deleted_at IS NULL
  `, [contactId, artId])
  if (contactData) {
    res.json({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      acceptContact: contactData.accept_contact,
      artPath: `/api/artes/${contactData.art_id}`,
      createdAt: contactData.created_at,
      updatedAt: contactData.updated_at
    })
  } else {
    res.status(404).end()
  }
})

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
