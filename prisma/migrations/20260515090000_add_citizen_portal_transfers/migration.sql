-- CreateEnum
CREATE TYPE "TransferRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "BirthRecord" ADD COLUMN "citizenAccessId" TEXT;

-- CreateTable
CREATE TABLE "BirthRecordCopy" (
    "id" TEXT NOT NULL,
    "birthRecordId" TEXT NOT NULL,
    "cityHallId" TEXT NOT NULL,
    "transferRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BirthRecordCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferRequest" (
    "id" TEXT NOT NULL,
    "status" "TransferRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requesterName" TEXT NOT NULL,
    "requesterPhone" TEXT,
    "reason" TEXT,
    "decisionNote" TEXT,
    "decidedAt" TIMESTAMP(3),
    "birthRecordId" TEXT NOT NULL,
    "sourceCityHallId" TEXT NOT NULL,
    "targetCityHallId" TEXT NOT NULL,
    "decidedByMaireId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecord_citizenAccessId_key" ON "BirthRecord"("citizenAccessId");

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecordCopy_transferRequestId_key" ON "BirthRecordCopy"("transferRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecordCopy_birthRecordId_cityHallId_key" ON "BirthRecordCopy"("birthRecordId", "cityHallId");

-- AddForeignKey
ALTER TABLE "BirthRecordCopy" ADD CONSTRAINT "BirthRecordCopy_birthRecordId_fkey" FOREIGN KEY ("birthRecordId") REFERENCES "BirthRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecordCopy" ADD CONSTRAINT "BirthRecordCopy_cityHallId_fkey" FOREIGN KEY ("cityHallId") REFERENCES "CityHall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecordCopy" ADD CONSTRAINT "BirthRecordCopy_transferRequestId_fkey" FOREIGN KEY ("transferRequestId") REFERENCES "TransferRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_birthRecordId_fkey" FOREIGN KEY ("birthRecordId") REFERENCES "BirthRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_sourceCityHallId_fkey" FOREIGN KEY ("sourceCityHallId") REFERENCES "CityHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_targetCityHallId_fkey" FOREIGN KEY ("targetCityHallId") REFERENCES "CityHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_decidedByMaireId_fkey" FOREIGN KEY ("decidedByMaireId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
