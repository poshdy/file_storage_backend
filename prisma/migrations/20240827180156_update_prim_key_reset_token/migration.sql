/*
  Warnings:

  - The primary key for the `reset_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[expiresAt,token]` on the table `reset_token` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `reset_token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "reset_token" DROP CONSTRAINT "reset_token_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "reset_token_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_expiresAt_token_key" ON "reset_token"("expiresAt", "token");
