/*
  Warnings:

  - Added the required column `errorServiceName` to the `JournalErrors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalErrors" ADD COLUMN     "errorServiceName" TEXT NOT NULL;
