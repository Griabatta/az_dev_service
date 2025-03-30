/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PerformanceToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[performanceTokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "performanceTokenId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_userId_key" ON "PerformanceToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_performanceTokenId_key" ON "User"("performanceTokenId");
