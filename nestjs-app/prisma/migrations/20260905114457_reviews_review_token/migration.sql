-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('CLIENT', 'EMPLOYER');

-- CreateTable
CREATE TABLE "ReviewToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ReviewType" NOT NULL,
    "projectId" UUID,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ReviewType" NOT NULL,
    "authorName" TEXT NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "avatarUrl" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER,
    "projectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewToken" ADD CONSTRAINT "ReviewToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
