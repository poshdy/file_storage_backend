import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { TFolder } from 'src/types/folder.types';
import { FolderData } from './dto/create-folder-dto';
import { AuthenticationGuard } from 'src/core/auth/guards/authentication.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user';
import { FolderGuard } from './guards/folder.guard';
import { GetFolderId } from './decorators/get-folder-id';

@UseGuards(AuthenticationGuard)
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  // POST CREATE FOLDER
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createFolder(
    @Body() data: FolderData,
    @GetCurrentUser() user: { id: string },
  ) {
    return await this.folderService.createFolder(data, user.id);
  }
  // GET ALL FOLDERS
  @HttpCode(HttpStatus.OK)
  @Get()
  async getFolders(@GetCurrentUser() user: { id: string }): Promise<TFolder[]> {
    return await this.folderService.getFolders(user.id);
  }

  // GET FOLDER BY ID
  @UseGuards(FolderGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':folderId')
  async getFolder(@GetFolderId() folderId: string): Promise<TFolder> {
    return this.folderService.getFolder(folderId);
  }

  // UPDATE FOLDER
  @UseGuards(FolderGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':folderId')
  async updateFolder(
    @Body() body: { name: string },
    @GetFolderId() folderId: string,
  ): Promise<TFolder> {
    return await this.folderService.updateFolder(folderId, body.name);
  }
  // DELETE FOLDER
  @UseGuards(FolderGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':folderId')
  async deleteFolder(@GetFolderId() folderId: string): Promise<TFolder> {
    return await this.folderService.deleteFolder(folderId);
  }

  // ADD FILES TO FOLDER
  @UseGuards(FolderGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':folderId/files')
  async addFiles(
    @Body() body: { files: string[] },
    @GetCurrentUser() user: { id: string },
    @GetFolderId() folderId: string,
  ) {
    return await this.folderService.addFiles(body.files, user.id, folderId);
  }

  // DELETE FILE FROM FOLDER
  @UseGuards(FolderGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':folderId/files/:fileId')
  async deleteFileFromFolder(
    @Param() params: { fileId: string },
    @GetCurrentUser() user: { id: string },
    @GetFolderId() folderId: string,
  ) {
    return await this.folderService.deleteFileFromFolder(
      params.fileId,
      folderId,
      user.id,
    );
  }
}
