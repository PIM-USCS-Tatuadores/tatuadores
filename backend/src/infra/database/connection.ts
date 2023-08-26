export interface IConnection {
  query(query: string, params: any[]): Promise<any>
  transaction(callback: TransactionCallback): Promise<any>
  close(): Promise<void>
}

export type TransactionCallback = (transaction: IConnection) => Promise<any>
