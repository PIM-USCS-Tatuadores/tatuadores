import pgp from 'pg-promise'
import { IConnection, TransactionCallback } from "./connection";

export class PgPromiseAdapter implements IConnection {
  private connection: any

  constructor() {
    this.connection = pgp()('postgres://postgres:123456@localhost:5432/tattoo')
  }

  query(query: string, params: any) {
    return this.connection.query(query, params)
  }

  transaction(callback: TransactionCallback): Promise<any> {
    return this.connection.tx(callback)
  }

  async close() {
      await this.connection.$pool.end()
  }
}
