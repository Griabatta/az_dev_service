/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Reports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reports_uuid_key" ON "Reports"("uuid");
