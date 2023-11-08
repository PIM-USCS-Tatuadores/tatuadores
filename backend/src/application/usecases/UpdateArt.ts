import { IArtRepository } from "../repository/ArtRepository";

export class UpdateArt {
  constructor(readonly artRepository: IArtRepository) {}

  async execute(input: UpdateArtInput): Promise<UpdateArtOutput> {
    const art = {
      artId: input.artId,
      title: input.title,
      description: input.description,
      price: input.price,
      size: input.size,
      href: input.href,
      altText: input.altText
    }
    await this.artRepository.update(art, input.artistId)
    return { artId: input.artId }
  }
}

type UpdateArtInput = {
  artId: string,
  title?: string,
  description?: string,
  price?: number,
  size?: number,
  href?: string,
  altText?: string,
  artistId: string
}

type UpdateArtOutput = {
  artId: string
}
