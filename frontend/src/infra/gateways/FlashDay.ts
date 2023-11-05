export interface IFlashDayGateway {
  get(id: string, options?: FlashDayGatewayOptions): Promise<FlashDay>;
  getAllById(id: string, options?: FlashDayGatewayOptions): Promise<FlashDay[]>;
  create(data: FlashDayDTO, options?: FlashDayGatewayOptions): Promise<any>;
  update(id: string, data: UpdateFlashDayDTO, options?: FlashDayGatewayOptions): Promise<any>;
  getArt(id: string, options?: FlashDayGatewayOptions): Promise<Art>;
  getArts(id: string, options?: FlashDayGatewayOptions): Promise<Art[]>;
  createArt(id: string, data: CreateArtDTO, options?: FlashDayGatewayOptions): Promise<any>;
  updateArt(id: string, data: UpdateArtDTO, options?: FlashDayGatewayOptions): Promise<any>;
}

export type FlashDayDTO = {
  id?: string,
  title: string,
  starts_at: string,
  ends_at: string,
  phone: string,
  active?: boolean,
  artist_id?: string
}

export type UpdateFlashDayDTO = {
  title?: string,
  starts_at?: string,
  ends_at?: string,
  phone?: string,
  active?: boolean,
  artist_id: string
}

export type CreateArtDTO = {
  title: string,
  description: string,
  price: number,
  size: number,
  href: string,
  alt?: string
}

export type UpdateArtDTO = {
  title?: string,
  description?: string,
  price?: number,
  size?: number,
  href?: string,
  alt?: string
}

export type ArtDTO = {
  id: string,
  title: string,
  description: string,
  price: number,
  size: number,
  href: string,
  alt_text: string,
  flash_day_id: string | undefined
}

export type Art = {
  id: string,
  title: string,
  description: string,
  price: number,
  size: number,
  href: string,
  altText: string,
  flashDayId?: string | null
}

export type FlashDay = {
  id: string,
  name: string,
  startsAt: Date,
  endsAt: Date | undefined,
  phone: string,
  active: boolean,
  artistId: string,
}

export type FlashDayGatewayOptions = {
  signal?: AbortSignal,
  headers?: any
}
