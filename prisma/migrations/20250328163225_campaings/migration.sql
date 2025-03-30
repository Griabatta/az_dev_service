/*
  Warnings:

  - The primary key for the `CampaignTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `budgetType` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `endWeekDay` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `expenseStrategy` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `filters` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `maxBid` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `placement` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `productAutopilotStrategy` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `productCampaignMode` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `skuAddMode` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `startWeekDay` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `CampaignTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyBudget` on the `CampaignTemplate` table. All the data in the column will be lost.
  - The `id` column on the `CampaignTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `campaingId` to the `CampaignTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `CampaignTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignTemplate" DROP CONSTRAINT "CampaignTemplate_pkey",
DROP COLUMN "budgetType",
DROP COLUMN "categoryId",
DROP COLUMN "endWeekDay",
DROP COLUMN "expenseStrategy",
DROP COLUMN "filters",
DROP COLUMN "maxBid",
DROP COLUMN "paymentType",
DROP COLUMN "placement",
DROP COLUMN "productAutopilotStrategy",
DROP COLUMN "productCampaignMode",
DROP COLUMN "skuAddMode",
DROP COLUMN "startWeekDay",
DROP COLUMN "state",
DROP COLUMN "templateId",
DROP COLUMN "weeklyBudget",
ADD COLUMN     "campaingId" TEXT NOT NULL,
ADD COLUMN     "cpmType" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "advObjectType" DROP NOT NULL,
ALTER COLUMN "fromDate" DROP NOT NULL,
ALTER COLUMN "fromDate" SET DATA TYPE TEXT,
ALTER COLUMN "toDate" SET DATA TYPE TEXT,
ALTER COLUMN "dailyBudget" DROP NOT NULL,
ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "CampaignTemplate_pkey" PRIMARY KEY ("id");
