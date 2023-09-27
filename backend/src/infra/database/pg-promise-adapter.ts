import pgp, { IDatabase } from 'pg-promise'
import { IConnection, TransactionCallback } from "./connection";

export class PgPromiseAdapter implements IConnection {
  private connection: IDatabase<any>

  constructor() {
    this.connection = pgp()({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT as string, 10),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      max: 30
    })
  }

  one(query: string, params: any[]): Promise<any> {
    return this.connection.one(query, params)
  }

  query(query: string, params: any[]) {
    return this.connection.query(query, params)
  }

  transaction(callback: TransactionCallback): Promise<any> {
    return this.connection.tx(callback)
  }

  async close() {
    await this.connection.$pool.end()
  }
}
