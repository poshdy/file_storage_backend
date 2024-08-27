import { Injectable } from '@nestjs/common';
import { FolderRepo } from './folder.repo';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';
@Injectable()
export class FolderService {
  constructor(private readonly folderRepo: FolderRepo) {}

  async getFolders(userId: string): Promise<TFolder[]> {
    return await this.folderRepo.getFolders(userId);
  }
  async getFolder(folderId: string): Promise<TFolder> {
    return await this.folderRepo.getFolder(folderId);
  }
  async updateFolder(folderId: string, name: string) {
    return await this.folderRepo.updateFolder(folderId, name);
  }
  async deleteFolder(folderId: string) {
    return await this.folderRepo.deleteFolder(folderId);
  }
  async createFolder(data: FolderData, userId: string) {
    return await this.folderRepo.createFolder(data, userId);
  }

  async addFiles(data: string[], userId: string, folderId: string) {
    return await this.folderRepo.addFiles(data, userId, folderId);
  }

  async deleteFileFromFolder(fileId: string, folderId: string, userId: string) {
    return await this.folderRepo.deleteFileFromFolder(fileId, folderId, userId);
  }
}
