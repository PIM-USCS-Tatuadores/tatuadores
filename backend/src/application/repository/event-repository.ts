import { Event } from "../../domain/event";

export interface IEventRepository {
  get(eventId: string): Promise<Event | undefined>
  save(userId: string, event: Event): Promise<void>
}
