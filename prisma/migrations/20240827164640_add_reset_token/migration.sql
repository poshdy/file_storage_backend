/*
  Warnings:

  - You are about to drop the `OTPVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OTPVerification";

-- CreateTable
CREATE TABLE "reset_token" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_token_pkey" PRIMARY KEY ("userId","token")
);

-- CreateTable
CREATE TABLE "otp_token" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reset_token" ADD CONSTRAINT "reset_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
