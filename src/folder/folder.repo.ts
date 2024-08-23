import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/prisma/prisma.service';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';

@Injectable()
export class FolderRepo {
  constructor(private readonly database: DatabaseService) {}

  async getFolders(): Promise<TFolder[]> {
    return await this.database.folder.findMany();
  }
  async getFolder(folderId: string, userId: string): Promise<TFolder> {
    return await this.database.folder.findUnique({
      where: {
        id: folderId,
        userId,
      },
    });
  }
  async createFolder(data: FolderData) {
    return await this.database.folder.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    });
  }
  async updateFolder(folderId: string, name: string, userId: string) {
    return await this.database.folder.update({
      data: {
        name,
      },
      where: {
        id: folderId,
        userId,
      },
    });
  }
  async deleteFolder(folderId: string, userId: string) {
    return await this.database.folder.delete({
      where: {
        id: folderId,
        userId,
      },
    });
  }
}
