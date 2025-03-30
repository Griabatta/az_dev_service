/*
  Warnings:

  - You are about to drop the column `unknown_metric` on the `Analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "unknown_metric";
