import { ContactRepositoryMemory } from "../../infra/repository/ContactRepositoryMemory"
import { CreateContact } from "./CreateContact"

describe('CreateArt', () => {
  test('Deve criar uma arte para um evento flash day', async () => {
    const artRepository = new ContactRepositoryMemory()
    const usecase = new CreateContact(artRepository)
    const input = {
      name: 'john doe',
      email: 'john@doe.com',
      phone: '11999999999',
      acceptContact: true,
      artId: '123456'
    }
    const output = await usecase.execute(input)
    expect(output.contactId).toBeDefined()
  })
})
