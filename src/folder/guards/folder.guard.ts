import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FolderService } from '../folder.service';

@Injectable()
export class FolderGuard implements CanActivate {
  constructor(private readonly folderService: FolderService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const folderId = request.params.folderId;
    const folder = await this.folderService.getFolder(folderId);
    return folder.userId == user.id;
  }
}
