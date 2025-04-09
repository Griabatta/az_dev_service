/*
  Warnings:

  - A unique constraint covering the columns `[userId,dimensionsId,createAt]` on the table `Analytics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offer_id]` on the table `Product_List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,offer_id,createAt]` on the table `Product_List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,sku,warehouse_name,createAt]` on the table `Stock_Warehouse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operation_id]` on the table `Transaction_List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,operation_id,createAt]` on the table `Transaction_List` will be added. If there are existing duplicate values, this will fail.

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
CREATE UNIQUE INDEX "Analytics_userId_dimensionsId_createAt_key" ON "Analytics"("userId", "dimensionsId", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_List_offer_id_key" ON "Product_List"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_List_userId_offer_id_createAt_key" ON "Product_List"("userId", "offer_id", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Warehouse_userId_sku_warehouse_name_createAt_key" ON "Stock_Warehouse"("userId", "sku", "warehouse_name", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_List_operation_id_key" ON "Transaction_List"("operation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_List_userId_operation_id_createAt_key" ON "Transaction_List"("userId", "operation_id", "createAt");
