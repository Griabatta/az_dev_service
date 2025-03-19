-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "revenue" DROP NOT NULL,
ALTER COLUMN "ordered_units" DROP NOT NULL,
ALTER COLUMN "unknown_metric" DROP NOT NULL,
ALTER COLUMN "hits_view_pdp" DROP NOT NULL,
ALTER COLUMN "hits_view" DROP NOT NULL,
ALTER COLUMN "hits_tocart_search" DROP NOT NULL,
ALTER COLUMN "hits_tocart_pdp" DROP NOT NULL,
ALTER COLUMN "hits_tocart" DROP NOT NULL,
ALTER COLUMN "session_view_search" DROP NOT NULL,
ALTER COLUMN "session_view_pdp" DROP NOT NULL,
ALTER COLUMN "session_view" DROP NOT NULL,
ALTER COLUMN "conv_tocart_search" DROP NOT NULL,
ALTER COLUMN "conv_tocart_pdp" DROP NOT NULL,
ALTER COLUMN "conv_tocart" DROP NOT NULL,
ALTER COLUMN "returns" DROP NOT NULL,
ALTER COLUMN "cancellations" DROP NOT NULL,
ALTER COLUMN "delivered_units" DROP NOT NULL,
ALTER COLUMN "position_category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product_List" ALTER COLUMN "quant_code" DROP NOT NULL,
ALTER COLUMN "quant_size" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stock_Warehouse" ALTER COLUMN "idc" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction_List" ALTER COLUMN "delivery_schema" DROP NOT NULL,
ALTER COLUMN "order_date" DROP NOT NULL,
ALTER COLUMN "posting_number" DROP NOT NULL,
ALTER COLUMN "warehouse_id" DROP NOT NULL,
ALTER COLUMN "name_item" DROP NOT NULL,
ALTER COLUMN "sku_item" DROP NOT NULL,
ALTER COLUMN "name_services" DROP NOT NULL,
ALTER COLUMN "price_services" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ALTER COLUMN "mpStatToken" DROP NOT NULL;
