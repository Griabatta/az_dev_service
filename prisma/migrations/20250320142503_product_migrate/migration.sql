/*
  Warnings:

  - You are about to drop the column `quant_code` on the `Product_List` table. All the data in the column will be lost.
  - You are about to drop the column `quant_size` on the `Product_List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product_List" DROP COLUMN "quant_code",
DROP COLUMN "quant_size",
ADD COLUMN     "quants" TEXT;
