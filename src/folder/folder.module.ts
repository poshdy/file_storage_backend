import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { FolderRepo } from './folder.repo';

@Module({
  providers: [FolderService,FolderRepo],
  controllers: [FolderController]
})
export class FolderModule {}
