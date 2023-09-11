import dotenv from 'dotenv'
import { resolve } from 'path'

export function config(environment: string | undefined) {
  switch(environment) {
    case 'test':
      dotenv.config({ path: resolve(__dirname, '../.env.test') })
      break;
    case 'development':
      dotenv.config({ path: resolve(__dirname, '../.env') })
      break;
    default:
      break;
  }
}
