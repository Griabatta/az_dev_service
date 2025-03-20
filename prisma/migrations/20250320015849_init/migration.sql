-- CreateTable
CREATE TABLE "JournalErrors" (
    "id" SERIAL NOT NULL,
    "errorUserId" INTEGER NOT NULL,
    "errorCode" TEXT,
    "errorMassage" TEXT NOT NULL,
    "errorPriority" INTEGER NOT NULL,
    "priorityDesign" TEXT NOT NULL DEFAULT '{0: smoll priority, 1: mean priority, 2: hight priority, 3: very hight priority}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalErrors_pkey" PRIMARY KEY ("id")
);
