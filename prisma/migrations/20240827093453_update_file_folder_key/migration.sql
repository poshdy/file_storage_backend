/*
  Warnings:

  - The primary key for the `file_folders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "file_folders" DROP CONSTRAINT "file_folders_pkey",
ADD CONSTRAINT "file_folders_pkey" PRIMARY KEY ("folderId", "fileId");
