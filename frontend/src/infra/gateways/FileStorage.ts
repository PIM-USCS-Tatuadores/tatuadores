export interface IFileStorageGateway {
  upload(file: File): Promise<{ url: string }>
}
