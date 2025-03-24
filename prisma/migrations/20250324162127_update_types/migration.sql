-- AlterTable
ALTER TABLE "Product_List" ALTER COLUMN "product_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction_List" ALTER COLUMN "operation_id" SET DATA TYPE TEXT,
ALTER COLUMN "warehouse_id" SET DATA TYPE TEXT;
