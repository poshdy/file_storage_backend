import { Injectable } from '@nestjs/common';
import { FileRepo } from './file.repo';
import { UploadService } from 'src/upload/upload.service';
import { CreatedFile } from 'src/types/file.types';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepo: FileRepo,
    private readonly uploadService: UploadService,
  ) {}

  async generateLink(objectName: string, duration: number) {
    const url = await this.uploadService.getObjectSignedUrl(
      objectName,
      duration,
    );
    return url;
  }
  async uploadFileMinio(files: Array<Express.Multer.File>, userId: string) {
    files.map(async (file) => {
      const name = await this.uploadService.uploadObject(
        file.buffer,
        file.size,
        file.mimetype,
      );
      const data = {
        ref: name,
        name: file.originalname,
        size: file.size,
        userId,
        type: file.mimetype,
      } satisfies CreatedFile;
      return await this.fileRepo.saveFile(data);
    });
  }
  async getFiles(userId: string) {
    return this.fileRepo.getFiles(userId);
  }

  async getFile(objectName: string) {
    return await this.fileRepo.getFile(objectName);
  }
  async getFileWithUrl(objectName: string) {
    const url = await this.uploadService.getObjectSignedUrl(objectName);
    const file = await this.fileRepo.getFile(objectName);

    const data = { url, ...file };
    return data;
  }
  async downloadFile(stream: Response, objectName: string) {
    const file = await this.getfile(objectName);
    await this.uploadService.downloadFile(stream, objectName);
    return file;
  }
  async getfile(objectName: string) {
    return this.fileRepo.getFile(objectName);
  }
  async deleteFile(fileName: string) {
    await this.uploadService.deleteObject(fileName);
    return this.fileRepo.deleteFile(fileName);
  }
}
