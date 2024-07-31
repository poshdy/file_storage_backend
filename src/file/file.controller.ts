import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { FileService } from './file.service';
import { Request, Response } from 'express';
// import { appendFileSync } from 'fs';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get('files')
  getFiles() {
    return this.fileService.getFiles();
  }
  // UploadedFile(@Req() req: Request, @Res() res: Response) {
  //   const fileName = req.header('file-name');

  //   req.on('data', (chunk) => {
  //     appendFileSync(fileName, chunk);
  //   });
  //   res
  //     .setHeader('access-control-allow-origin', 'http://localhost:3000')
  //     .setHeader('access-control-allow-credentials', 'true')
  //     .end('uploaded!');
}
