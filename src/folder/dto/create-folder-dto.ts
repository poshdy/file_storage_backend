import { IsArray, IsString } from 'class-validator';

export class FolderData {
  @IsString({ message: 'folder name must be string' })
  name: string;
}

export class FileFolderData {
  @IsArray()
  files: string[];
}
