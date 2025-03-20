-- AlterTable
ALTER TABLE "JournalErrors" ALTER COLUMN "priorityDesign" SET DEFAULT '{0: small priority, 1: mean priority, 2: hight priority, 3: very hight priority}';

-- AlterTable
ALTER TABLE "Transaction_List" ALTER COLUMN "items" DROP NOT NULL,
ALTER COLUMN "services" DROP NOT NULL;
