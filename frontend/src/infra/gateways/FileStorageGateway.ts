import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IFileStorageGateway } from "./FileStorage";

export class FileStorageGateway implements IFileStorageGateway {
  fileStorageClient: S3Client

  constructor() {
    this.fileStorageClient = new S3Client({
      region: process.env.NEXT_PUBLIC_S3_REGION,
      credentials: {
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY
      }
    })
  }

  async upload(file: File): Promise<{ url: string; }> {
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: file.name,
      Body: file
    })
    await this.fileStorageClient.send(command)
    const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${file.name}`
    return { url }
  }
}
