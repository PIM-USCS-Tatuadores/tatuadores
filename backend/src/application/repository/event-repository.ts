import { Event } from "../../domain/event";

export interface IEventRepository {
  save(userId: string, event: Event): Promise<void>
}
