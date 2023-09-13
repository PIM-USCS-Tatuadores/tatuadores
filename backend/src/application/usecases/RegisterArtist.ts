import { User } from "../../domain/User"
import { Artist } from "../../domain/Artist"
import { IUserRepository } from "../repository/UserRepository"
import { IArtistRepository } from "../repository/ArtistRepository"

export class RegisterArtist {
  constructor(
    readonly userRepository: IUserRepository,
    readonly artistRepository: IArtistRepository
  ) {}

  async execute(input: RegisterArtistInput): Promise<RegisterArtistOutput> {
    const user = User.create(input.email, input.password)
    const artist = new Artist(user.userId, input.name, input.document, input.email)
    await Promise.all([
      this.userRepository.save(user),
      this.artistRepository.save(artist)
    ])
    return {
      artistId: artist.artistId
    }
  }
}

type RegisterArtistInput = {
  name?: string,
  email: string,
  document?: string,
  password: string,
}

type RegisterArtistOutput = {
  artistId: string
}
