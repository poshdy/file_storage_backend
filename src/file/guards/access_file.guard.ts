import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { FileService } from '../file.service';

@Injectable()
export class AccessFileGuard implements CanActivate {
  constructor(private readonly fileService: FileService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestedId = request.params;
    const user = request?.user;
    const file = await this.fileService.getFile(requestedId.fileId);
    if (file.userId !== user.id) {
      return false;
    } else {
      return true;
    }
  }
}
