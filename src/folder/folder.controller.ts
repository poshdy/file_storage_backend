import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { FolderService } from './folder.service';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createFolder(@Body() data: FolderData){
    return await this.folderService.createFolder(data)
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  async getFolders(): Promise<TFolder[]> {
    return await this.folderService.getFolders();
  }
  @HttpCode(HttpStatus.OK)
  @Get(":folderId")
  async getFolder(@Param() params: {folderId:string}): Promise<TFolder> {
    return this.folderService.getFolder(params.folderId)
  }
  @HttpCode(HttpStatus.OK)
  @Patch(":folderId")
  async updateFolder(@Param() params: {folderId:string}): Promise<TFolder> {
    return await this.folderService.updateFolder(params.folderId);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":folderId")
  async deleteFolder(@Param() params: {folderId:string}): Promise<TFolder> {
    return await this.folderService.deleteFolder(params.folderId);
  }
}
