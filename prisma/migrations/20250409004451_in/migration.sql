/*
  Warnings:

  - The primary key for the `ProductReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `article` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `commission` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `isRewarded` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `ozonReviewId` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `photoCount` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewDate` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewText` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewUrl` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `rewardAmount` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `rewardDate` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `videoCount` on the `ProductReview` table. All the data in the column will be lost.
  - You are about to drop the column `avgRating` on the `Product_List` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Product_List` table. All the data in the column will be lost.
  - You are about to drop the column `rewardedReviewCount` on the `Product_List` table. All the data in the column will be lost.
  - Added the required column `order_status` to the `ProductReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published_at` to the `ProductReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductReview` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sku` on the `ProductReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_transactionId_fkey";

-- DropIndex
DROP INDEX "ProductReview_isRewarded_idx";

-- DropIndex
DROP INDEX "ProductReview_ozonReviewId_key";

-- DropIndex
DROP INDEX "ProductReview_productId_idx";

-- DropIndex
DROP INDEX "ProductReview_reviewDate_idx";

-- DropIndex
DROP INDEX "ProductReview_userId_idx";

-- DropIndex
DROP INDEX "ProductReview_userId_productId_reviewDate_key";

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
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_pkey",
DROP COLUMN "article",
DROP COLUMN "commission",
DROP COLUMN "createAt",
DROP COLUMN "isRewarded",
DROP COLUMN "isVerified",
DROP COLUMN "ozonReviewId",
DROP COLUMN "photoCount",
DROP COLUMN "productId",
DROP COLUMN "productName",
DROP COLUMN "reviewDate",
DROP COLUMN "reviewText",
DROP COLUMN "reviewUrl",
DROP COLUMN "rewardAmount",
DROP COLUMN "rewardDate",
DROP COLUMN "totalAmount",
DROP COLUMN "transactionId",
DROP COLUMN "updateAt",
DROP COLUMN "videoCount",
ADD COLUMN     "comments_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dislikes_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_rating_participant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likes_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "order_status" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "photos_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "text" TEXT,
ADD COLUMN     "videos" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "videos_amount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "sku",
ADD COLUMN     "sku" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ADD CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductReview_id_seq";

-- AlterTable
ALTER TABLE "Product_List" DROP COLUMN "avgRating",
DROP COLUMN "reviewCount",
DROP COLUMN "rewardedReviewCount",
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

-- CreateIndex
CREATE INDEX "ProductReview_sku_idx" ON "ProductReview"("sku");

-- CreateIndex
CREATE INDEX "ProductReview_published_at_idx" ON "ProductReview"("published_at");
