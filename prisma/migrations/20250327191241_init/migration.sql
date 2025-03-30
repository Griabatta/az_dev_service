/*
  Warnings:

  - You are about to drop the column `campaignId` on the `CampaignTemplate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CampaignTemplate_campaignId_key";

-- AlterTable
ALTER TABLE "CampaignTemplate" DROP COLUMN "campaignId";
