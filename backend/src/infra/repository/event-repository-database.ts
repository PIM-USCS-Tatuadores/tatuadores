import { IEventRepository } from "../../application/repository/event-repository";
import { Event } from "../../domain/event";
import { IConnection } from "../database/connection";

export class EventRepositoryDatabase implements IEventRepository {
  constructor(readonly connection: IConnection) {}

  async get(eventId: string): Promise<Event | undefined> {
    throw new Error("Method not implemented.");
  }

  async save(userId: string, event: Event): Promise<void> {
    await this.connection.query('INSERT INTO tattoo.event (id, user_id, title, starts_at, ends_at, phone, active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [event.eventId, userId, event.title, event.startsAt, event.endsAt, event.phone, event.active, new Date(), new Date()])
  }
}
