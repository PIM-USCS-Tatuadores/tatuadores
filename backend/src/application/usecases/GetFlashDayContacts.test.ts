import { Contact } from "../../domain/Contact"
import { ContactRepositoryMemory } from "../../infra/repository/ContactRepositoryMemory"
import { GetFlashDayContacts } from "./GetFlashDayContacts"

describe('GetFlashDayContacts', () => {
  test('Deve retornar todos contatos de um flash day', async () => {
    const repository = new ContactRepositoryMemory()
    const usecase = new GetFlashDayContacts(repository)
    const artistId = '123456'
    const flashDayId = '123456'
    const artId = '123456'
    repository.save(Contact.create('John Doe', 'john@doe.com', '11999999999', true), artId)
    repository.save(Contact.create('Jane Doe', 'jane@doe.com', '11999999998', false), artId)
    const output = await usecase.execute({ flashDayId, artistId })
    expect(output).toEqual([
      {
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@doe.com',
        phone: '11999999999',
        acceptContact: true
      },
      {
        id: expect.any(String),
        name: 'Jane Doe',
        email: 'jane@doe.com',
        phone: '11999999998',
        acceptContact: false
      }
    ])
  })
})
