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
    "dimensionsId" INTEGER,
    "dimensionsName" TEXT,
    "revenue" INTEGER,
    "ordered_units" INTEGER,
    "unknown_metric" INTEGER,
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
    "idc" DOUBLE PRECISION,

    CONSTRAINT "Stock_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction_List" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "operation_id" TEXT NOT NULL,
    "operation_type" TEXT NOT NULL,
    "operation_date" TEXT NOT NULL,
    "operation_type_name" TEXT NOT NULL,
    "delivery_charge" INTEGER NOT NULL,
    "return_delivery_charge" INTEGER NOT NULL,
    "accruals_for_sale" INTEGER NOT NULL,
    "sale_commission" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "delivery_schema" TEXT,
    "order_date" TEXT,
    "posting_number" TEXT,
    "warehouse_id" TEXT,
    "items" TEXT,
    "services" TEXT,

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
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalErrors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceToken" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "tokenType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceToken_pkey" PRIMARY KEY ("id")
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
