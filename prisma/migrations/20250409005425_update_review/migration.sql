/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `ProductReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,reviewId,createAt]` on the table `ProductReview` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductReview_published_at_idx";

-- DropIndex
DROP INDEX "ProductReview_sku_idx";

-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Bundle" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "CampaignTemplate" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "JournalErrors" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "PerformanceToken" ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ProductReview" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Product_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Reports" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Stock_Warehouse" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Transaction_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_reviewId_key" ON "ProductReview"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_userId_reviewId_createAt_key" ON "ProductReview"("userId", "reviewId", "createAt");
