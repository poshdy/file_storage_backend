/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `otp_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `otp_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "otp_token" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otp_token_userId_key" ON "otp_token"("userId");

-- AddForeignKey
ALTER TABLE "otp_token" ADD CONSTRAINT "otp_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
