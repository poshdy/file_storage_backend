import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsOwner implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.params.userId;
    const userToken = request.user;
    console.log(userToken.id, 'token id');
    console.log(requestUserId, 'request id');
    if (userToken.id === requestUserId) {
      return true;
    }

    return false;
  }
}
