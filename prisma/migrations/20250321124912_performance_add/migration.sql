-- AlterTable
ALTER TABLE "JournalErrors" ALTER COLUMN "priorityDesign" SET DEFAULT '{0: low priority, 1: mean priority, 2: hight priority, 3: very hight priority}';

-- CreateTable
CREATE TABLE "PerformanceToken" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "tokenType" TEXT NOT NULL,

    CONSTRAINT "PerformanceToken_pkey" PRIMARY KEY ("id")
);
