import crypto from 'crypto'

export class Art {
  constructor(
    readonly artId: string,
    readonly title: string,
    readonly description: string | undefined,
    readonly price: number,
    readonly size: number,
    readonly href: string,
    readonly altText: string | undefined
  ) {}

  static create(title: string, description: string | undefined, price: number, size: number, href: string, altText: string | undefined) {
    const artId = crypto.randomUUID()
    return new Art(artId, title, description, price, size, href, altText)
  }
}
