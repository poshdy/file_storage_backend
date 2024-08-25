/*
  Warnings:

  - A unique constraint covering the columns `[file_ref]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_ref` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "file_ref" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_file_ref_key" ON "files"("file_ref");
