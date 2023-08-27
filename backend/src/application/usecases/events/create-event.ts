import { Event } from '../../../domain/event';
import { IEventRepository } from '../../repository/event-repository';

export class CreateEvent {
  constructor(readonly eventRepository: IEventRepository) {}

  async execute(input: CreateEventInput): Promise<CreateEventOutput> {
    const userId = input.userId
    const event = Event.create(input.title, input.startsAt, input.endsAt, input.phone, input.active)
    this.eventRepository.save(userId, event)
    return { eventId: event.eventId }
  }
}

type CreateEventInput = {
  userId: string,
  title: string,
  startsAt: Date,
  endsAt?: Date,
  phone: string,
  active: boolean
}

type CreateEventOutput = {
  eventId: string
}
