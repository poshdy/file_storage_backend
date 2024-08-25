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

  async uploadFileMinio(file: Express.Multer.File, user: any) {
    const name = await this.uploadService.uploadObject(
      file.buffer,
      file.size,
      file.mimetype,
    );
    const data = {
      ref: name,
      name: file.originalname,
      size: file.size,
      userId: user.id,
      type: file.mimetype,
    } satisfies CreatedFile;
    return await this.fileRepo.saveFile(data);
  }
  async getFiles(userId: string) {
    return this.fileRepo.getFiles(userId);
  }
  async getFile(objectName: string) {
    return this.fileRepo.getFile(objectName);
  }
  async downloadFile(stream: Response, objectName: string) {
    const file = await this.getfile(objectName);
    await this.uploadService.downloadFile(stream, objectName);
    return file;
  }
  async getfile(objectName: string) {
    return this.fileRepo.getFile(objectName);
  }
  async deleteFile(id: string) {
    return this.fileRepo.deleteFile(id);
  }
}
