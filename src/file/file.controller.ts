import {
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { minioClient } from 'src/minio';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get()
  async getFiles() {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const t = await minioClient.putObject(
        'my-bucket',
        file.originalname,
        file.buffer,
        file.size,
      );
      if (t.etag) return `${file.originalname} uploaded sucessfully`;
    } catch (error) {
      console.log(error);
      return 'something went wrong';
    }
  }
}
