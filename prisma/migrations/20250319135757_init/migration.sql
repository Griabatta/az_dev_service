-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "clientSecretHash" TEXT NOT NULL,
    "mpStat" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "revenue" TEXT NOT NULL,
    "ordered_units" TEXT NOT NULL,
    "unknown_metric" TEXT NOT NULL,
    "hits_view_pdp" TEXT NOT NULL,
    "hits_view" TEXT NOT NULL,
    "hits_tocart_search" TEXT NOT NULL,
    "hits_tocart_pdp" TEXT NOT NULL,
    "hits_tocart" TEXT NOT NULL,
    "session_view_search" TEXT NOT NULL,
    "session_view_pdp" TEXT NOT NULL,
    "session_view" TEXT NOT NULL,
    "conv_tocart_search" TEXT NOT NULL,
    "conv_tocart_pdp" TEXT NOT NULL,
    "conv_tocart" TEXT NOT NULL,
    "returns" TEXT NOT NULL,
    "cancellations" TEXT NOT NULL,
    "delivered_units" TEXT NOT NULL,
    "position_category" TEXT NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock_Warehouse" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "sku" INTEGER NOT NULL,
    "warehouse_name" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "free_to_sell_amount" INTEGER NOT NULL,
    "promised_amount" INTEGER NOT NULL,
    "reserved_amount" INTEGER NOT NULL,
    "idc" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Stock_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction_List" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "operation_id" BIGINT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "operation_date" TEXT NOT NULL,
    "operation_type_name" TEXT NOT NULL,
    "delivery_charge" INTEGER NOT NULL,
    "return_delivery_charge" INTEGER NOT NULL,
    "accruals_for_sale" INTEGER NOT NULL,
    "sale_commission" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "delivery_schema" TEXT NOT NULL,
    "order_date" TEXT NOT NULL,
    "posting_number" TEXT NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "name_item" TEXT NOT NULL,
    "sku_item" BIGINT NOT NULL,
    "name_services" TEXT NOT NULL,
    "price_services" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_List" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "has_fbo_stocks" BOOLEAN NOT NULL,
    "has_fbs_stocks" BOOLEAN NOT NULL,
    "is_discounted" BOOLEAN NOT NULL,
    "offer_id" TEXT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quant_code" TEXT NOT NULL,
    "quant_size" INTEGER NOT NULL,

    CONSTRAINT "Product_List_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_Warehouse" ADD CONSTRAINT "Stock_Warehouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_List" ADD CONSTRAINT "Transaction_List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_List" ADD CONSTRAINT "Product_List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
