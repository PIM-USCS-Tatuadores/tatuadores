import { Art } from "../../domain/Art";
import { IArtRepository } from "../repository/ArtRepository";

export class CreateArt {
  constructor(readonly artRepository: IArtRepository) {}

  async execute(input: CreateArtInput): Promise<CreateArtOutput> {
    const art = Art.create(input.title, input.description, input.price, input.size, input.href, input.altText)
    await this.artRepository.save(art, input.flashDayId)
    return { artId: art.artId }
  }
}

type CreateArtInput = {
  title: string,
  description?: string,
  price: number,
  size: number,
  href: string,
  altText?: string,
  flashDayId: string
}

type CreateArtOutput = {
  artId: string
}
