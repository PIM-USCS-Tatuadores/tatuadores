import crypto from 'crypto'

export class Event {
  constructor(
    readonly eventId: string,
    readonly title: string,
    readonly startsAt: Date,
    readonly endsAt: Date | undefined,
    readonly phone: string,
    readonly active: boolean
  ) {}

  static create(title: string, startsAt: Date, endsAt: Date | undefined, phone: string, active: boolean) {
    const eventId = crypto.randomUUID()
    return new Event(eventId, title, startsAt, endsAt, phone, active)
  }
}
