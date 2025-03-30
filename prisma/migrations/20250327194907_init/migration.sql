/*
  Warnings:

  - Added the required column `templateId` to the `CampaignTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignTemplate" ADD COLUMN     "templateId" TEXT NOT NULL;
