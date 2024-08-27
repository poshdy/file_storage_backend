-- DropForeignKey
ALTER TABLE "file_folders" DROP CONSTRAINT "file_folders_fileId_fkey";

-- DropForeignKey
ALTER TABLE "file_folders" DROP CONSTRAINT "file_folders_folderId_fkey";

-- DropForeignKey
ALTER TABLE "file_folders" DROP CONSTRAINT "file_folders_userId_fkey";

-- AddForeignKey
ALTER TABLE "file_folders" ADD CONSTRAINT "file_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_folders" ADD CONSTRAINT "file_folders_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_folders" ADD CONSTRAINT "file_folders_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
