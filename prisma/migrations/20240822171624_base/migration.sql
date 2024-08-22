/*
  Warnings:

  - You are about to drop the column `file_ref` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_url]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_url` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "files_file_ref_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "file_ref",
ADD COLUMN     "file_url" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_file_url_key" ON "files"("file_url");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
