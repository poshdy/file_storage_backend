import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/prisma/prisma.service';
import { CreatedFile } from 'src/types/file.types';

@Injectable()
export class FileRepo {
  constructor(private readonly database: DatabaseService) {}

  async getFiles(userId: string) {
    return await this.database.file.findMany({
      where: {
        userId,
      },
    });
  }
  async getFile(objectName: string) {
    return await this.database.file.findUnique({
      where: {
        file_ref: objectName,
      },
    });
  }

  async saveFile(data: CreatedFile) {
    return await this.database.file.create({
      data: {
        name: data.name,
        type: data.type,
        file_ref: data.ref,
        userId: data.userId,
        size: data.size,
      },
    });
  }
  async deleteFile(fileName: string) {
    return await this.database.file.delete({
      where: {
        file_ref: fileName,
      },
    });
  }
}
