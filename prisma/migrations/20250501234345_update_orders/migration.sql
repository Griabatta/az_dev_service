/*
  Warnings:

  - A unique constraint covering the columns `[nmIdCreatedAt]` on the table `OrdersWb` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nmIdCreatedAt` to the `OrdersWb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "config"."JournalErrors" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "config"."Users" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."AccountOzon" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Analytics" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Bundle" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."CampaignTemplate" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."PerformanceToken" ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."ProductReview" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Product_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Reports" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Stock_Warehouse" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Transaction_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "wb"."OrdersWb" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nmIdCreatedAt" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "warehouseName" DROP NOT NULL,
ALTER COLUMN "warehouseType" DROP NOT NULL,
ALTER COLUMN "countryName" DROP NOT NULL,
ALTER COLUMN "oblastOkrugName" DROP NOT NULL,
ALTER COLUMN "regionName" DROP NOT NULL,
ALTER COLUMN "supplierArticle" DROP NOT NULL,
ALTER COLUMN "barcode" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "techSize" DROP NOT NULL,
ALTER COLUMN "incomeID" DROP NOT NULL,
ALTER COLUMN "isSupply" DROP NOT NULL,
ALTER COLUMN "isRealization" DROP NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL,
ALTER COLUMN "discountPercent" DROP NOT NULL,
ALTER COLUMN "spp" DROP NOT NULL,
ALTER COLUMN "finishedPrice" DROP NOT NULL,
ALTER COLUMN "priceWithDisc" DROP NOT NULL,
ALTER COLUMN "isCancel" DROP NOT NULL,
ALTER COLUMN "cancelDate" DROP NOT NULL,
ALTER COLUMN "orderType" DROP NOT NULL,
ALTER COLUMN "sticker" DROP NOT NULL,
ALTER COLUMN "gNumber" DROP NOT NULL,
ALTER COLUMN "srid" DROP NOT NULL;

-- CreateTable
CREATE TABLE "wb"."nmIdList" (
    "id" SERIAL NOT NULL,
    "nmid" TEXT NOT NULL,
    "imtID" TEXT,
    "nmUUID" TEXT,
    "subjectID" TEXT,
    "subjectName" TEXT,
    "vendorCode" TEXT,
    "title" TEXT,
    "brand" TEXT,
    "photos" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nmIdList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nmIdList_nmid_key" ON "wb"."nmIdList"("nmid");

-- CreateIndex
CREATE UNIQUE INDEX "OrdersWb_nmIdCreatedAt_key" ON "wb"."OrdersWb"("nmIdCreatedAt");
