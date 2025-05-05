-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "config";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ozon";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "wb";

-- CreateTable
CREATE TABLE "config"."Users" (
    "id" SERIAL NOT NULL,
    "tgId" TEXT,
    "tableSheetId" TEXT NOT NULL,
    "name" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."Task" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."JournalErrors" (
    "id" SERIAL NOT NULL,
    "errorUserId" INTEGER NOT NULL,
    "errorCode" TEXT,
    "errorMassage" TEXT NOT NULL,
    "errorPriority" INTEGER NOT NULL,
    "errorServiceName" TEXT NOT NULL,
    "priorityDesign" TEXT NOT NULL DEFAULT '{0: low priority, 1: mean priority, 2: hight priority, 3: very hight priority}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "JournalErrors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wb"."AccountWb" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AccountWb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wb"."OrdersWb" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "warehouseType" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "oblastOkrugName" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    "supplierArticle" TEXT NOT NULL,
    "nmId" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "techSize" TEXT NOT NULL,
    "incomeID" TEXT NOT NULL,
    "isSupply" BOOLEAN NOT NULL,
    "isRealization" BOOLEAN NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "spp" INTEGER NOT NULL,
    "finishedPrice" INTEGER NOT NULL,
    "priceWithDisc" INTEGER NOT NULL,
    "isCancel" BOOLEAN NOT NULL,
    "cancelDate" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "sticker" TEXT NOT NULL,
    "gNumber" TEXT NOT NULL,
    "srid" TEXT NOT NULL,

    CONSTRAINT "OrdersWb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wb"."SalesWb" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "warehouseType" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "oblastOkrugName" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    "supplierArticle" TEXT NOT NULL,
    "nmId" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "techSize" TEXT NOT NULL,
    "incomeID" TEXT NOT NULL,
    "isSupply" BOOLEAN NOT NULL,
    "isRealization" BOOLEAN NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "spp" INTEGER NOT NULL,
    "paymentSaleAmount" INTEGER NOT NULL,
    "forPay" INTEGER NOT NULL,
    "finishedPrice" INTEGER NOT NULL,
    "priceWithDisc" INTEGER NOT NULL,
    "saleID" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "sticker" TEXT NOT NULL,
    "gNumber" TEXT NOT NULL,
    "srid" TEXT NOT NULL,

    CONSTRAINT "SalesWb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wb"."StockWb" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "supplierArticle" TEXT NOT NULL,
    "nmId" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "inWayToClient" INTEGER NOT NULL,
    "inWayFromClient" INTEGER NOT NULL,
    "quantityFull" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "techSize" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "Discount" INTEGER NOT NULL,
    "isSupply" BOOLEAN NOT NULL,
    "isRealization" BOOLEAN NOT NULL,
    "SCCode" TEXT NOT NULL,

    CONSTRAINT "StockWb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."AccountOzon" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "clientPerforId" TEXT,
    "clientSecret" TEXT,
    "mpStatToken" TEXT,
    "tableId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "performanceTokenId" INTEGER,

    CONSTRAINT "AccountOzon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."CampaignTemplate" (
    "id" SERIAL NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cpmType" TEXT,
    "advObjectType" TEXT,
    "title" TEXT,
    "fromDate" TEXT,
    "toDate" TEXT,
    "dailyBudget" TEXT,
    "budget" TEXT,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "CampaignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Analytics" (
    "id" SERIAL NOT NULL,
    "dimensionsId" INTEGER,
    "dimensionsName" TEXT,
    "dimensionsDate" TEXT,
    "revenue" INTEGER,
    "ordered_units" INTEGER,
    "hits_view_search" INTEGER,
    "hits_view_pdp" INTEGER,
    "hits_view" INTEGER,
    "hits_tocart_search" INTEGER,
    "hits_tocart_pdp" INTEGER,
    "hits_tocart" INTEGER,
    "session_view_search" INTEGER,
    "session_view_pdp" INTEGER,
    "session_view" INTEGER,
    "conv_tocart_search" INTEGER,
    "conv_tocart_pdp" INTEGER,
    "conv_tocart" INTEGER,
    "returns" INTEGER,
    "cancellations" INTEGER,
    "delivered_units" INTEGER,
    "position_category" INTEGER,
    "accountId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Stock_Warehouse" (
    "id" SERIAL NOT NULL,
    "sku" INTEGER NOT NULL,
    "warehouse_name" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "free_to_sell_amount" INTEGER NOT NULL,
    "promised_amount" INTEGER NOT NULL,
    "reserved_amount" INTEGER NOT NULL,
    "idc" DOUBLE PRECISION,
    "accountId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Stock_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Stock_Analytic" (
    "id" SERIAL NOT NULL,
    "ads" TEXT NOT NULL,
    "available_stock_count" INTEGER NOT NULL,
    "cluster_id" INTEGER NOT NULL,
    "cluster_name" TEXT NOT NULL,
    "days_without_sales" INTEGER NOT NULL,
    "excess_stock_count" INTEGER NOT NULL,
    "expiring_stock_count" INTEGER NOT NULL,
    "idc" TEXT NOT NULL,
    "item_tags" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "other_stock_count" INTEGER NOT NULL,
    "requested_stock_count" INTEGER NOT NULL,
    "return_from_customer_stock_count" INTEGER NOT NULL,
    "return_to_seller_stock_count" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "stock_defect_stock_count" INTEGER NOT NULL,
    "transit_defect_stock_count" INTEGER NOT NULL,
    "transit_stock_count" INTEGER NOT NULL,
    "turnover_grade" TEXT NOT NULL,
    "valid_stock_count" INTEGER NOT NULL,
    "waiting_docs_stock_count" INTEGER NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "warehouse_name" TEXT NOT NULL,
    "request_date" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Stock_Analytic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Transaction_List" (
    "id" SERIAL NOT NULL,
    "operation_id" TEXT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "operation_date" TEXT NOT NULL,
    "operation_type_name" TEXT NOT NULL,
    "delivery_charge" INTEGER NOT NULL,
    "return_delivery_charge" INTEGER NOT NULL,
    "accruals_for_sale" INTEGER NOT NULL,
    "sale_commission" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT,
    "delivery_schema" TEXT,
    "order_date" TEXT,
    "posting_number" TEXT,
    "warehouse_id" TEXT,
    "items" TEXT,
    "services" TEXT,
    "accountId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Transaction_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Product_List" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "has_fbo_stocks" BOOLEAN NOT NULL,
    "has_fbs_stocks" BOOLEAN NOT NULL,
    "is_discounted" BOOLEAN NOT NULL,
    "offer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quants" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Product_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."SKU_List" (
    "id" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "SKU_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."PerformanceToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "PerformanceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Reports" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'In Progress',
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SKU',
    "accountId" INTEGER NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."Bundle" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "campaigns" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'In progress',
    "accountId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."CampaignItem" (
    "id" SERIAL NOT NULL,
    "searchQuery" TEXT,
    "sku" TEXT,
    "title" TEXT,
    "price" TEXT,
    "views" INTEGER,
    "clicks" INTEGER,
    "ctr" TEXT,
    "toCart" INTEGER,
    "avgBid" TEXT,
    "moneySpent" TEXT,
    "orders" INTEGER,
    "ordersMoney" TEXT,
    "models" INTEGER,
    "modelsMoney" TEXT,
    "drr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAtDB" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CampaignItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ozon"."ProductReview" (
    "id" SERIAL NOT NULL,
    "reviewId" TEXT NOT NULL,
    "comments_amount" INTEGER NOT NULL,
    "is_rating_participant" BOOLEAN NOT NULL,
    "order_status" TEXT NOT NULL,
    "photos_amount" INTEGER NOT NULL,
    "published_at" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "offerId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "videos_amount" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config"."CronLock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_tgId_key" ON "config"."Users"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_tableSheetId_key" ON "config"."Users"("tableSheetId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "config"."Task"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AccountWb_token_key" ON "wb"."AccountWb"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_clientId_key" ON "ozon"."AccountOzon"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_apiKey_key" ON "ozon"."AccountOzon"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_clientPerforId_key" ON "ozon"."AccountOzon"("clientPerforId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_clientSecret_key" ON "ozon"."AccountOzon"("clientSecret");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_tableId_key" ON "ozon"."AccountOzon"("tableId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountOzon_performanceTokenId_key" ON "ozon"."AccountOzon"("performanceTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTemplate_campaignId_accountId_createdAt_key" ON "ozon"."CampaignTemplate"("campaignId", "accountId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_accountId_dimensionsId_dimensionsDate_key" ON "ozon"."Analytics"("accountId", "dimensionsId", "dimensionsDate");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Warehouse_accountId_sku_warehouse_name_createAt_key" ON "ozon"."Stock_Warehouse"("accountId", "sku", "warehouse_name", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_List_accountId_operation_id_createAt_key" ON "ozon"."Transaction_List"("accountId", "operation_id", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_List_accountId_offer_id_createAt_key" ON "ozon"."Product_List"("accountId", "offer_id", "createAt");

-- CreateIndex
CREATE UNIQUE INDEX "SKU_List_accountId_SKU_key" ON "ozon"."SKU_List"("accountId", "SKU");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_token_key" ON "ozon"."PerformanceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_accountId_key" ON "ozon"."PerformanceToken"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_uuid_key" ON "ozon"."Reports"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_campaigns_key" ON "ozon"."Bundle"("campaigns");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignItem_accountId_createdAtDB_campaignId_key" ON "ozon"."CampaignItem"("accountId", "createdAtDB", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_accountId_reviewId_published_at_key" ON "ozon"."ProductReview"("accountId", "reviewId", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "CronLock_name_key" ON "config"."CronLock"("name");

-- AddForeignKey
ALTER TABLE "wb"."AccountWb" ADD CONSTRAINT "AccountWb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "config"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wb"."OrdersWb" ADD CONSTRAINT "OrdersWb_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "wb"."AccountWb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wb"."SalesWb" ADD CONSTRAINT "SalesWb_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "wb"."AccountWb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wb"."StockWb" ADD CONSTRAINT "StockWb_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "wb"."AccountWb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."AccountOzon" ADD CONSTRAINT "AccountOzon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "config"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."CampaignTemplate" ADD CONSTRAINT "CampaignTemplate_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Analytics" ADD CONSTRAINT "Analytics_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Stock_Warehouse" ADD CONSTRAINT "Stock_Warehouse_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Stock_Analytic" ADD CONSTRAINT "Stock_Analytic_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Transaction_List" ADD CONSTRAINT "Transaction_List_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Product_List" ADD CONSTRAINT "Product_List_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."SKU_List" ADD CONSTRAINT "SKU_List_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."PerformanceToken" ADD CONSTRAINT "PerformanceToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Reports" ADD CONSTRAINT "Reports_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Reports" ADD CONSTRAINT "Reports_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "ozon"."Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."Bundle" ADD CONSTRAINT "Bundle_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."CampaignItem" ADD CONSTRAINT "CampaignItem_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ozon"."ProductReview" ADD CONSTRAINT "ProductReview_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ozon"."AccountOzon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
