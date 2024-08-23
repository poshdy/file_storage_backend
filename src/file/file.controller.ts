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
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async getFiles() {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      await this.fileService.uploadFileMinio(file);
    } catch (error) {
      console.log(error);
      return 'something went wrong';
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':fileId/download')
  async downloadFile(@Param() params: { fileId: string }) {
    const url = await this.fileService.downloadFile(params.fileId);
    return {
      data: {
        url,
      },
    };
  }
}
