-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "clientPerforId" TEXT,
    "clientSecret" TEXT,
    "mpStatToken" TEXT,
    "name" TEXT,
    "email" TEXT,
    "tgId" TEXT,
    "tableSheetId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "performanceTokenId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignTemplate" (
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
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "CampaignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" SERIAL NOT NULL,
    "dimensionsId" INTEGER,
    "dimensionsName" TEXT,
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
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock_Warehouse" (
    "id" SERIAL NOT NULL,
    "sku" INTEGER NOT NULL,
    "warehouse_name" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "free_to_sell_amount" INTEGER NOT NULL,
    "promised_amount" INTEGER NOT NULL,
    "reserved_amount" INTEGER NOT NULL,
    "idc" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Stock_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction_List" (
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
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Transaction_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_List" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
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
CREATE TABLE "JournalErrors" (
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
CREATE TABLE "PerformanceToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "PerformanceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'In Progress',
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SKU',
    "userId" INTEGER NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "campaigns" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'In progress',
    "userId" INTEGER NOT NULL,
    "reportsId" INTEGER,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE)::timestamp,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignItem" (
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
    "createdAtDB" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CampaignItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientPerforId_key" ON "User"("clientPerforId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientSecret_key" ON "User"("clientSecret");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tgId_key" ON "User"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tableSheetId_key" ON "User"("tableSheetId");

-- CreateIndex
CREATE UNIQUE INDEX "User_performanceTokenId_key" ON "User"("performanceTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTemplate_campaignId_key" ON "CampaignTemplate"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_token_key" ON "PerformanceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceToken_userId_key" ON "PerformanceToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_uuid_key" ON "Reports"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_bundleId_key" ON "Reports"("bundleId");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_campaigns_key" ON "Bundle"("campaigns");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_reportsId_key" ON "Bundle"("reportsId");

-- AddForeignKey
ALTER TABLE "CampaignTemplate" ADD CONSTRAINT "CampaignTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_Warehouse" ADD CONSTRAINT "Stock_Warehouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_List" ADD CONSTRAINT "Transaction_List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_List" ADD CONSTRAINT "Product_List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceToken" ADD CONSTRAINT "PerformanceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignItem" ADD CONSTRAINT "CampaignItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
