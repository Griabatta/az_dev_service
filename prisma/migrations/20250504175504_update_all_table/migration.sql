/*
  Warnings:

  - You are about to drop the `Bundle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reports` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dimensionsIdCreatedAt]` on the table `Analytics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skuCreatedAt]` on the table `CampaignItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campaignIdCreatedAt]` on the table `CampaignTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerIdCreatedAt]` on the table `Product_List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[SKU]` on the table `SKU_List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerIdCreatedAt]` on the table `Stock_Analytic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skuCreatedAt]` on the table `Stock_Warehouse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operationIdCreatedAt]` on the table `Transaction_List` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dimensionsIdCreatedAt` to the `Analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuCreatedAt` to the `CampaignItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignIdCreatedAt` to the `CampaignTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerIdCreatedAt` to the `Product_List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerIdCreatedAt` to the `Stock_Analytic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuCreatedAt` to the `Stock_Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationIdCreatedAt` to the `Transaction_List` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ozon"."Bundle" DROP CONSTRAINT "Bundle_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ozon"."ProductReview" DROP CONSTRAINT "ProductReview_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ozon"."Reports" DROP CONSTRAINT "Reports_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ozon"."Reports" DROP CONSTRAINT "Reports_bundleId_fkey";

-- DropIndex
DROP INDEX "ozon"."Analytics_accountId_dimensionsId_dimensionsDate_key";

-- DropIndex
DROP INDEX "ozon"."CampaignItem_accountId_createdAtDB_campaignId_key";

-- DropIndex
DROP INDEX "ozon"."CampaignTemplate_campaignId_accountId_createdAt_key";

-- DropIndex
DROP INDEX "ozon"."Product_List_accountId_offer_id_createAt_key";

-- DropIndex
DROP INDEX "ozon"."SKU_List_accountId_SKU_key";

-- DropIndex
DROP INDEX "ozon"."Stock_Warehouse_accountId_sku_warehouse_name_createAt_key";

-- DropIndex
DROP INDEX "ozon"."Transaction_List_accountId_operation_id_createAt_key";

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
ALTER TABLE "ozon"."Analytics" ADD COLUMN     "dimensionsIdCreatedAt" TEXT NOT NULL,
ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."CampaignItem" ADD COLUMN     "skuCreatedAt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ozon"."CampaignTemplate" ADD COLUMN     "campaignIdCreatedAt" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."PerformanceToken" ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Product_List" ADD COLUMN     "offerIdCreatedAt" TEXT NOT NULL,
ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Stock_Analytic" ADD COLUMN     "offerIdCreatedAt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ozon"."Stock_Warehouse" ADD COLUMN     "skuCreatedAt" TEXT NOT NULL,
ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "ozon"."Transaction_List" ADD COLUMN     "operationIdCreatedAt" TEXT NOT NULL,
ALTER COLUMN "createAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updateAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ozon"."Bundle";

-- DropTable
DROP TABLE "ozon"."ProductReview";

-- DropTable
DROP TABLE "ozon"."Reports";

-- CreateTable
CREATE TABLE "config"."TaskCompleted" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLET',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."TaskUnCompleted" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "errorCode" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskUnCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_dimensionsIdCreatedAt_key" ON "ozon"."Analytics"("dimensionsIdCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignItem_skuCreatedAt_key" ON "ozon"."CampaignItem"("skuCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTemplate_campaignIdCreatedAt_key" ON "ozon"."CampaignTemplate"("campaignIdCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_List_offerIdCreatedAt_key" ON "ozon"."Product_List"("offerIdCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SKU_List_SKU_key" ON "ozon"."SKU_List"("SKU");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Analytic_offerIdCreatedAt_key" ON "ozon"."Stock_Analytic"("offerIdCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Warehouse_skuCreatedAt_key" ON "ozon"."Stock_Warehouse"("skuCreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_List_operationIdCreatedAt_key" ON "ozon"."Transaction_List"("operationIdCreatedAt");
