import { IArtistRepository } from "../repository/ArtistRepository";

export class GetArtist {
  constructor(readonly artistRepository: IArtistRepository) {}

  async execute(input: GetArtistInput): Promise<GetArtistOutput | undefined> {
    const artistId = input.artistId
    const artist = await this.artistRepository.get(artistId)
    if (artist) {
      return {
        artistId: artist.artistId,
        name: artist.name,
        document: artist.cpf?.value,
        email: artist.email.value
      }
    }
    return
  }
}

type GetArtistInput = {
  artistId: string
}

type GetArtistOutput = {
  artistId: string,
  name: string | undefined,
  document: string | undefined,
  email: string
}
