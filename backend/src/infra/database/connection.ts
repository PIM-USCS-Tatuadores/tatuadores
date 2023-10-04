export interface IConnection {
  one(query: string, params: any[]): Promise<any>
  query(query: string, params: any[]): Promise<any>
  transaction(callback: TransactionCallback): Promise<any>
  close(): Promise<void>
}

export type TransactionCallback = (transaction: IConnection) => Promise<any>
