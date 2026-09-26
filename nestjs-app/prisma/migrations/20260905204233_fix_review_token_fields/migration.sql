/*
  Warnings:

  - You are about to drop the column `createAt` on the `ReviewToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReviewToken" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiresAt" DROP DEFAULT;
