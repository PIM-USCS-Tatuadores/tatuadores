import { IEventRepository } from "../../application/repository/event-repository";
import { Event } from "../../domain/event";

export class EventRepositoryMemory implements IEventRepository {
  private events = new Map<string, Event>()

  async get(eventId: string): Promise<Event | undefined> {
    return this.events.get(eventId)
  }

  async save(userId: string, event: Event): Promise<void> {
    this.events.set(event.eventId, Object.assign({}, event, { userId }))
  }
}
