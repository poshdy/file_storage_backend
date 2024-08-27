import {
  Controller,
  Post,
  Res,
  Get,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/core/auth/guards/authentication.guard';
import { FileGuard } from './guards/access_file.guard';
import { Response } from 'express';
import { File } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/get-current-user';
import { GetFileName } from './decorators/get-file-name';
@UseGuards(AuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // UPLOAD FILE TO MINIO AND SAVE IT TO DB
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetCurrentUser() user: { id: string },
  ) {
    try {
      await this.fileService.uploadFileMinio(files, user.id);
      return {
        message: 'Uploaded!',
      };
    } catch (error) {
      console.log(error);
      return 'something went wrong';
    }
  }

  // GET ALL USER FILES / files/{userId}
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUserFiles(
    @GetCurrentUser() user: { id: string },
  ): Promise<File[]> {
    return await this.fileService.getFiles(user.id);
  }

  // GET USER FILE
  @UseGuards(FileGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':fileId')
  async getFile(@GetFileName() fileName: string) {
    return await this.fileService.getFileWithUrl(fileName);
  }

  // DOWNLOAD FILE
  @UseGuards(FileGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':fileId/download')
  async downloadFile(
    @GetFileName() fileName: string,
    @Res() response: Response,
  ) {
    const file = await this.fileService.getFile(fileName);
    const stream = response.writeHead(200, {
      'content-Type': file.type,
      'content-Disposition': `attachment; filename=${file.name}`,
    });
    await this.fileService.downloadFile(stream, fileName);
    return { message: `${file.name} downloaded successfully` };
  }

  // DELETE FILE BY FILE_NAME
  @UseGuards(FileGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':fileId')
  async deleteFile(@GetFileName() fileName: string) {
    return await this.fileService.deleteFile(fileName);
  }

  // POST GENERATE PREVIEW LINK FOR SHARING
  @UseGuards(FileGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':fileId/preview')
  async generatePreview(
    @Body() body: { duration: number },
    @GetFileName() fileName: string,
  ): Promise<{ url: string }> {
    const { duration } = body;
    const url = await this.fileService.generateLink(fileName, duration);
    return {
      url,
    };
  }
}
