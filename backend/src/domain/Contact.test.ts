import { Contact } from "./Contact"

describe('Contact', () => {
  test('Deve criar um contato', () => {
    const contact = Contact.create('John Doe', 'john@doe.com', '11949729444', true)
    expect(contact.name).toBe('John Doe')
    expect(contact.email.value).toBe('john@doe.com')
    expect(contact.phone.value).toBe('11949729444')
    expect(contact.acceptContact).toBe(true)
  })
})
