import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
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

  async getObjectSignedUrl(objectName: string, duration: number = 1000) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      objectName,
      duration,
    );
  }

  generateUniqueObjectName(bytes: number = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
  async deleteObject(objectName: string) {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      console.log('file deleted successfully');
    } catch (error) {
      console.error(error);
    }
  }
  async uploadObject(content: Buffer, size: number, type: string) {
    const name = this.generateUniqueObjectName();
    await this.minioClient.putObject(this.bucketName, name, content, size, {
      'Content-Type': type,
    });

    return name;
  }

  async downloadFile(stream: Response, objectName: string) {
    const data = await this.minioClient.getObject(this.bucketName, objectName);
    data.on('data', (chunk) => {
      stream.write(chunk);
    });
    data.on('end', () => {
      console.log('ended');
      stream.end();
    });
    data.on('error', (err) => {
      console.log(err);
    });
  }
}
