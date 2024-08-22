import { Injectable } from '@nestjs/common';
import { FolderRepo } from './folder.repo';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';
@Injectable()
export class FolderService {
  constructor(private readonly folderRepo: FolderRepo) {}

  async getFolders(): Promise<TFolder[]> {

    return await this.folderRepo.getFolders();
  }
  async getFolder(folderId: string): Promise<TFolder> {
    return await this.folderRepo.getFolder(folderId);
  }
  async updateFolder(folderId: string) {
    return await this.folderRepo.updateFolder(folderId);
  }
  async deleteFolder(folderId: string) {
    return await this.folderRepo.deleteFolder(folderId);
  }
  async createFolder(data: FolderData) {
    return await this.folderRepo.createFolder(data);
  }
}
