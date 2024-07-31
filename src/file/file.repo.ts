import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/prisma/prisma.service';

@Injectable()
export class FileRepo {
  constructor(private readonly database: DatabaseService) {}

  async getFiles() {
    return await this.database.file.findMany();
  }
  async getFile(id: string) {
    return await this.database.file.findUnique({
      where: {
        id,
      },
    });
  }

  async saveFile(name: string, type: string, ref: string) {
    return await this.database.file.create({
      data: {
        name,
        type,
        file_ref: ref,
      },
    });
  }
  async deleteFile(id: string) {
    return await this.database.file.delete({
      where: {
        id,
      },
    });
  }
}
