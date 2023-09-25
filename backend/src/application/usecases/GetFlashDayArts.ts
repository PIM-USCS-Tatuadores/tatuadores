import { IArtRepository } from "../repository/ArtRepository";

export class GetFlashDayArts {
  constructor(readonly artRepository: IArtRepository) {}

  async execute(input: GetFlashDayArtsInput): Promise<GetFlashDayArtsOutput> {
    const arts = await this.artRepository.getAllByFlashDay(input.flashDayId)
    return arts.map(art => ({
      id: art.artId,
      title: art.title,
      description: art.description,
      price: art.price,
      size: art.size,
      href: art.href,
      altText: art.altText
    }))
  }
}

type GetFlashDayArtsInput = {
  flashDayId: string
}

type GetFlashDayArtsOutput = {
  id: string,
  title: string,
  description: string | undefined,
  price: number,
  size: number,
  href: string,
  altText: string | undefined
}[]
