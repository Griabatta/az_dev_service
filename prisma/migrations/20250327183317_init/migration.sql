/*
  Warnings:

  - You are about to drop the `CampaignTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CampaignTemplate" DROP CONSTRAINT "CampaignTemplate_userId_fkey";

-- DropTable
DROP TABLE "CampaignTemplate";

-- CreateTable
CREATE TABLE "campaign_templates" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "advObjectType" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3),
    "dailyBudget" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productCampaignMode" TEXT NOT NULL,
    "productAutopilotStrategy" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "expenseStrategy" TEXT NOT NULL,
    "weeklyBudget" TEXT NOT NULL,
    "budgetType" TEXT NOT NULL,
    "startWeekDay" TEXT,
    "endWeekDay" TEXT,
    "maxBid" TEXT,
    "categoryId" TEXT,
    "skuAddMode" TEXT,
    "filters" TEXT,
    "placement" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "campaign_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_templates_campaignId_key" ON "campaign_templates"("campaignId");

-- AddForeignKey
ALTER TABLE "campaign_templates" ADD CONSTRAINT "campaign_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
