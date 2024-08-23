import { Injectable } from '@nestjs/common';
import { FileRepo } from './file.repo';
import { minioClient } from 'src/minio';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepo: FileRepo,
    private readonly uploadService: UploadService,
  ) {}

  async uploadFileMinio(file: Express.Multer.File) {
    await this.uploadService.uploadObject(
      file.buffer,
      file.size,
      file.mimetype,
    );
  }
  async downloadFile(ob: string) {
    return await this.uploadService.getObjectSignedUrl(ob);
  }

  async createFileRecord() {
    return;
  }

  async getFiles() {
    return this.fileRepo.getFiles();
  }
  async getfile(id: string) {
    return this.fileRepo.getFile(id);
  }
  async deleteFile(id: string) {
    return this.fileRepo.deleteFile(id);
  }
}
