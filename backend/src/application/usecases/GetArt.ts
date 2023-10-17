import { IArtRepository } from "../repository/ArtRepository";

export class GetArt {
  constructor(readonly artRepository: IArtRepository) {}

  async execute(input: GetArtInput): Promise<GetArtOutput | undefined> {
    const art = await this.artRepository.get(input.artId)
    if (art) {
      return {
        artId: art.artId,
        title: art.title,
        description: art.description,
        price: art.price,
        size: art.size,
        href: art.href,
        altText: art.altText,
        flashDayId: art.flashDayId
      }
    }
    return
  }
}

type GetArtInput = {
  artId: string
}

type GetArtOutput = {
  artId: string,
  title: string,
  description: string | undefined,
  price: number,
  size: number,
  href: string,
  altText: string | undefined,
  flashDayId: string
}
