import { EventRepositoryMemory } from "../../../infra/repository/event-repository-memory"
import { CreateEvent } from "./create-event"

describe('CreateEvent', () => {
  test('Deve criar um evento', async () => {
    const repository = new EventRepositoryMemory()
    const usecase = new CreateEvent(repository)
    const input = {
      userId: '1',
      title: 'Flash Tattoo #1',
      startsAt: new Date(),
      phone: '11999999999',
      active: true
    }
    const { eventId } = await usecase.execute(input)
    const event = await repository.get(eventId)
    expect(event).toEqual(expect.objectContaining({
      eventId,
      title: 'Flash Tattoo #1',
      startsAt: expect.any(Date),
      endsAt: undefined,
      phone: '11999999999',
      active: true,
    }))
  })
})
