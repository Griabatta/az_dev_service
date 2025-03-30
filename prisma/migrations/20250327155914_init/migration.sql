/*
  Warnings:

  - You are about to drop the column `accessToken` on the `PerformanceToken` table. All the data in the column will be lost.
  - You are about to drop the column `expires_in` on the `PerformanceToken` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `PerformanceToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PerformanceToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `PerformanceToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `PerformanceToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `PerformanceToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PerformanceToken" DROP COLUMN "accessToken",
DROP COLUMN "expires_in",
DROP COLUMN "tokenType",
DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CampaignTemplate" (
    "id" SERIAL NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CampaignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTemplate_templateId_key" ON "CampaignTemplate"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_token_key" ON "PerformanceToken"("token");

-- AddForeignKey
ALTER TABLE "CampaignTemplate" ADD CONSTRAINT "CampaignTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
