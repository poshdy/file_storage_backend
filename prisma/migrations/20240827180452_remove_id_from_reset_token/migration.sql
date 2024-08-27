/*
  Warnings:

  - The primary key for the `reset_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `reset_token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reset_token" DROP CONSTRAINT "reset_token_pkey",
DROP COLUMN "id";
