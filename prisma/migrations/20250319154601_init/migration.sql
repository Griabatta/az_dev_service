/*
  Warnings:

  - You are about to drop the column `mpStat` on the `User` table. All the data in the column will be lost.
  - Added the required column `mpStatToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "updateAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mpStat",
ADD COLUMN     "mpStatToken" TEXT NOT NULL;
