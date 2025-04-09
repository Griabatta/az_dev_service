-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Bundle" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "CampaignTemplate" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "JournalErrors" ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "PerformanceToken" ALTER COLUMN "updatedAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "createdAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Product_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Reports" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Stock_Warehouse" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "Transaction_List" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createAt" SET DEFAULT (CURRENT_DATE)::timestamp,
ALTER COLUMN "updateAt" SET DEFAULT (CURRENT_DATE)::timestamp;

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" SERIAL NOT NULL,
    "productName" VARCHAR(255) NOT NULL,
    "article" VARCHAR(100),
    "sku" VARCHAR(100) NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "rewardDate" TIMESTAMP(3),
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "reviewText" TEXT,
    "reviewUrl" VARCHAR(500),
    "isRewarded" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "transactionId" INTEGER,
    "ozonReviewId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_ozonReviewId_key" ON "ProductReview"("ozonReviewId");

-- CreateIndex
CREATE INDEX "ProductReview_userId_idx" ON "ProductReview"("userId");

-- CreateIndex
CREATE INDEX "ProductReview_productId_idx" ON "ProductReview"("productId");

-- CreateIndex
CREATE INDEX "ProductReview_reviewDate_idx" ON "ProductReview"("reviewDate");

-- CreateIndex
CREATE INDEX "ProductReview_isRewarded_idx" ON "ProductReview"("isRewarded");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_userId_productId_reviewDate_key" ON "ProductReview"("userId", "productId", "reviewDate");

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product_List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction_List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
