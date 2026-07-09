/*
  Warnings:

  - A unique constraint covering the columns `[declarationRef]` on the table `BirthRecord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[citizenTrackingCode]` on the table `BirthRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BirthRecord" ADD COLUMN     "citizenTrackingCode" TEXT,
ADD COLUMN     "declarationRef" TEXT,
ADD COLUMN     "isCompletedByCitizen" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecord_declarationRef_key" ON "BirthRecord"("declarationRef");

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecord_citizenTrackingCode_key" ON "BirthRecord"("citizenTrackingCode");
