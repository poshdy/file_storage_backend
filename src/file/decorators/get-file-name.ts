import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetFileName = createParamDecorator(
  (fileName: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.params.fileId;
  },
);
