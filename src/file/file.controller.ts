import {
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Param,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AccessFileGuard } from './guards/access_file.guard';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user';
import { File } from '@prisma/client';
import { IsOwner } from 'src/guards/IsOwner.guard';
import { Response } from 'express';

@UseGuards(AuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // UPLOAD FILE TO MINIO AND SAVE IT TO DB
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUser() user: any,
  ) {
    try {
      console.log(file);
      return await this.fileService.uploadFileMinio(file, user);
    } catch (error) {
      console.log(error);
      return 'something went wrong';
    }
  }

  // GET ALL USER FILES / files/{userId}
  @UseGuards(IsOwner)
  @HttpCode(HttpStatus.OK)
  @Get(':userId')
  async getAllUserFiles(@Param() params: { userId: string }): Promise<File[]> {
    return await this.fileService.getFiles(params.userId);
  }

  // DOWNLOAD FILE
  @UseGuards(AccessFileGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':fileId/download')
  async downloadFile(
    @Param() params: { fileId: string },
    @Res() response: Response,
  ) {
    const file = await this.fileService.getFile(params.fileId);
    const stream = response.writeHead(200, {
      'content-Type': file.type,
      'content-Disposition': `attachment; filename=${file.name}`,
    });
    await this.fileService.downloadFile(stream, params.fileId);
    return { message: `${file.name} downloaded successfully` };
  }
}
