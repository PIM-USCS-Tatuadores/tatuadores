export interface IFlashDayGateway {
  get(id: string, options?: FlashDayGatewayOptions): Promise<FlashDay>;
  getAllById(id: string, options?: FlashDayGatewayOptions): Promise<FlashDay[]>;
  create(data: FlashDayDTO, options?: FlashDayGatewayOptions): Promise<any>;
  update(id: string, data: UpdateFlashDayDTO, options?: FlashDayGatewayOptions): Promise<any>;
}

export type FlashDayDTO = {
  id?: string,
  title: string,
  starts_at: string,
  ends_at: string,
  phone: string,
  active?: boolean,
  artist_id: string
}

export type UpdateFlashDayDTO = {
  title?: string,
  starts_at?: string,
  ends_at?: string,
  phone?: string,
  active?: boolean,
  artist_id: string
}

export type FlashDay = {
  id: string,
  name: string,
  startsAt: Date,
  endsAt: Date | undefined,
  phone: string,
  active: boolean
}

export type FlashDayGatewayOptions = {
  signal?: AbortSignal,
  headers?: any
}