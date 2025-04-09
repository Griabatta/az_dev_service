/*
  Warnings:

  - You are about to drop the column `avgRating` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `rewardedReviewCount` on the `ProductReview` table. All the data in the column will be lost.

*/
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
ALTER TABLE "ProductReview" DROP COLUMN "avgRating",
DROP COLUMN "reviewCount",
DROP COLUMN "rewardedReviewCount";

-- AlterTable
ALTER TABLE "Product_List" ADD COLUMN     "avgRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER DEFAULT 0,
ADD COLUMN     "rewardedReviewCount" INTEGER DEFAULT 0,
ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
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
