-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientPerforId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "clientSecret" DROP NOT NULL;
