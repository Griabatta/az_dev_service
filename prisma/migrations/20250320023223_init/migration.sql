/*
  Warnings:

  - You are about to drop the column `name_item` on the `Transaction_List` table. All the data in the column will be lost.
  - You are about to drop the column `name_services` on the `Transaction_List` table. All the data in the column will be lost.
  - You are about to drop the column `price_services` on the `Transaction_List` table. All the data in the column will be lost.
  - You are about to drop the column `sku_item` on the `Transaction_List` table. All the data in the column will be lost.
  - Added the required column `items` to the `Transaction_List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services` to the `Transaction_List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction_List" DROP COLUMN "name_item",
DROP COLUMN "name_services",
DROP COLUMN "price_services",
DROP COLUMN "sku_item",
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "services" JSONB NOT NULL;
