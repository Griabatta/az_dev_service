/*
  Warnings:

  - The `revenue` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ordered_units` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unknown_metric` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hits_view_pdp` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hits_view` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hits_tocart_search` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hits_tocart_pdp` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hits_tocart` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session_view_search` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session_view_pdp` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session_view` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `conv_tocart_search` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `conv_tocart_pdp` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `conv_tocart` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `returns` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cancellations` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `delivered_units` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `position_category` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "revenue",
ADD COLUMN     "revenue" INTEGER,
DROP COLUMN "ordered_units",
ADD COLUMN     "ordered_units" INTEGER,
DROP COLUMN "unknown_metric",
ADD COLUMN     "unknown_metric" INTEGER,
DROP COLUMN "hits_view_pdp",
ADD COLUMN     "hits_view_pdp" INTEGER,
DROP COLUMN "hits_view",
ADD COLUMN     "hits_view" INTEGER,
DROP COLUMN "hits_tocart_search",
ADD COLUMN     "hits_tocart_search" INTEGER,
DROP COLUMN "hits_tocart_pdp",
ADD COLUMN     "hits_tocart_pdp" INTEGER,
DROP COLUMN "hits_tocart",
ADD COLUMN     "hits_tocart" INTEGER,
DROP COLUMN "session_view_search",
ADD COLUMN     "session_view_search" INTEGER,
DROP COLUMN "session_view_pdp",
ADD COLUMN     "session_view_pdp" INTEGER,
DROP COLUMN "session_view",
ADD COLUMN     "session_view" INTEGER,
DROP COLUMN "conv_tocart_search",
ADD COLUMN     "conv_tocart_search" INTEGER,
DROP COLUMN "conv_tocart_pdp",
ADD COLUMN     "conv_tocart_pdp" INTEGER,
DROP COLUMN "conv_tocart",
ADD COLUMN     "conv_tocart" INTEGER,
DROP COLUMN "returns",
ADD COLUMN     "returns" INTEGER,
DROP COLUMN "cancellations",
ADD COLUMN     "cancellations" INTEGER,
DROP COLUMN "delivered_units",
ADD COLUMN     "delivered_units" INTEGER,
DROP COLUMN "position_category",
ADD COLUMN     "position_category" INTEGER;
