/*
  Warnings:

  - You are about to drop the column `apiKeyHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecretHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `apiKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSecret` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "apiKeyHash",
DROP COLUMN "clientSecretHash",
ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "clientSecret" TEXT NOT NULL;
