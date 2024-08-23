import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as crypto from 'node:crypto';
@Injectable()

export class UploadService {
  private readonly minioClient = new Minio.Client({
    accessKey: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
    secretKey: this.configService.getOrThrow('MINIO_SECRET'),
    port: 9000,
    endPoint: 'localhost',
    useSSL: false,
  });

  private readonly bucketName = this.configService.getOrThrow('BUCKET_NAME');

  constructor(private readonly configService: ConfigService) {}

  async getObjectSignedUrl(objectName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      objectName,
      1000,
    );
  }

  generateUniqueObjectName(bytes: number = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
  async deleteObject(objectName: string) {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }
  async uploadObject(content: Buffer, size: number, type: string) {
    const name = this.generateUniqueObjectName();
     return await this.minioClient.putObject(
      this.bucketName,
      name,
      content,
      size,
      {
        'Content-Type': type,
      },
    );
  }
}
