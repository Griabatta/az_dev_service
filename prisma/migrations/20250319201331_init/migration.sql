/*
  Warnings:

  - You are about to drop the column `name` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Analytics` table. All the data in the column will be lost.
  - Added the required column `dimensions` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "name",
DROP COLUMN "sku",
ADD COLUMN     "dimensions" JSONB NOT NULL;
