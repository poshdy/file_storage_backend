/*
  Warnings:

  - The primary key for the `reset_token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "reset_token" DROP CONSTRAINT "reset_token_pkey",
ADD CONSTRAINT "reset_token_pkey" PRIMARY KEY ("expiresAt", "token");
