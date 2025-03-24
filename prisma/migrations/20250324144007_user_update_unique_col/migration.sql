/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientPerforId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientSecret]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientPerforId_key" ON "User"("clientPerforId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientSecret_key" ON "User"("clientSecret");
