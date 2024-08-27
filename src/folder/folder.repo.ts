import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/prisma/prisma.service';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';

@Injectable()
export class FolderRepo {
  constructor(private readonly database: DatabaseService) {}

  async getFolders(userId: string): Promise<TFolder[]> {
    return await this.database.folder.findMany({
      where: {
        userId,
      },
      include: {
        File_Folders: {
          select: {
            file: {
              select: {
                name: true,
                id: true,
                file_ref: true,
              },
            },
          },
        },
      },
    });
  }
  async getFolder(folderId: string, userId?: string): Promise<TFolder> {
    return await this.database.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        File_Folders: {
          select: {
            file: {
              select: {
                name: true,
                id: true,
                file_ref: true,
              },
            },
          },
        },
      },
    });
  }
  async createFolder(data: FolderData, userId: string) {
    return await this.database.folder.create({
      data: {
        name: data.name,
        userId,
      },
    });
  }
  async updateFolder(folderId: string, name: string) {
    return await this.database.folder.update({
      data: {
        name,
      },
      where: {
        id: folderId,
      },
    });
  }
  async deleteFolder(folderId: string) {
    return await this.database.folder.delete({
      where: {
        id: folderId,
      },
    });
  }
  async addFiles(files: string[], userId: string, folderId: string) {
    const data = files.map((file) => ({
      userId,
      folderId,
      fileId: file,
    }));
    return await this.database.file_Folders.createMany({ data: data });
  }
  async deleteFileFromFolder(fileId: string, folderId: string, userId: string) {
    return await this.database.file_Folders.delete({
      where: {
        folderId_fileId: {
          fileId,
          folderId,
        },
        userId,
      },
    });
  }
}
