import { IHttpClient } from '../http/HttpClient';

import {
  FlashDay,
  FlashDayDTO,
  FlashDayGatewayOptions,
  IFlashDayGateway,
  UpdateFlashDayDTO
} from './FlashDay'

export class FlashDayGateway implements IFlashDayGateway {
  constructor(readonly httpClient: IHttpClient) {}

  async get(id: string, options?: FlashDayGatewayOptions) {
    const endpoint = `/api/v1/flash_days/${id}`
    const response: FlashDayDTO = await this.httpClient.get(endpoint, options)
    return this.transformFlashDay(response)
  }

  async getAllById(id: string, options?: FlashDayGatewayOptions) {
    const endpoint = `/api/v1/artists/${id}/flash_days`
    const response: FlashDayDTO[] = await this.httpClient.get(endpoint, {
      signal: options?.signal,
      headers: Object.assign({}, options?.headers, {
        'Content-Type': 'application/json'
      })
    })
    return response.map(this.transformFlashDay)
  }

  async create(data: FlashDayDTO, options?: FlashDayGatewayOptions) {
    const endpoint = '/api/v1/flash_days'
    const body = {
      title: data.title,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
      phone: data.phone,
      active: data.active
    }
    const response: FlashDayDTO = await this.httpClient.post(endpoint, body, {
      signal: options?.signal,
      headers: Object.assign({}, options?.headers, {
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    });
    return response
  }

  async update(id: string, data: UpdateFlashDayDTO, options?: FlashDayGatewayOptions) {
    const endpoint = `/api/v1/flash_days/${id}`
    const response = await this.httpClient.patch(endpoint, data, {
      signal: options?.signal,
      headers: Object.assign({}, options?.headers, {
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    })
    return response
  }

  private transformFlashDay(data: FlashDayDTO): FlashDay {
    const startsAt = new Date(data.starts_at)
    const endsAt = data.ends_at ? new Date(data.ends_at) : undefined
    if (!data.id) throw new Error('Flash day response does not have an valid id')
    return {
      id: data.id,
      name: data.title,
      startsAt,
      endsAt,
      phone: data.phone,
      active: !!data.active
    }
  }
}
