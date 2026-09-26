-- DropForeignKey
ALTER TABLE "project_images" DROP CONSTRAINT "project_images_projectId_fkey";

-- AlterTable
ALTER TABLE "project_images" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
