import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { DatabaseModule } from './core/prisma/prisma.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';
import { UploadModule } from './upload/upload.module';
import { VerificationModule } from './core/verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    FileModule,
    FolderModule,
    UploadModule,
    VerificationModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
