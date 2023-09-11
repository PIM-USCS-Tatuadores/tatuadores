import crypto from 'crypto'
import { Phone } from './Phone'

export class FlashDay {
  constructor(
    readonly flashDayId: string,
    readonly title: string,
    readonly startsAt: Date,
    readonly endsAt: Date | undefined,
    readonly phone: Phone,
    readonly active: boolean
  ) {}

  static create(title: string, startsAt: Date, endsAt: Date | undefined, phone: string, active: boolean) {
    const flashDayId = crypto.randomUUID()
    return new FlashDay(flashDayId, title, startsAt, endsAt, new Phone(phone), active)
  }
}
