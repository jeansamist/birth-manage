-- CreateEnum
CREATE TYPE "BirthStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROCESSING', 'PENDING_APPROVAL', 'APPROVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('NATURAL', 'CAESAREAN', 'FORCEPS', 'VACUUM');

-- CreateTable
CREATE TABLE "BirthRecord" (
    "id" TEXT NOT NULL,
    "status" "BirthStatus" NOT NULL DEFAULT 'DRAFT',
    "babyFirstName" TEXT,
    "babyLastName" TEXT,
    "babyGender" "Gender",
    "birthDate" TIMESTAMP(3),
    "birthTime" TEXT,
    "birthPlace" TEXT,
    "weightGrams" INTEGER,
    "heightCm" DOUBLE PRECISION,
    "apgarScore" INTEGER,
    "deliveryType" "DeliveryType",
    "medicalNotes" TEXT,
    "motherFirstName" TEXT,
    "motherLastName" TEXT,
    "motherBirthDate" TIMESTAMP(3),
    "motherNationality" TEXT,
    "motherCni" TEXT,
    "motherProfession" TEXT,
    "motherAddress" TEXT,
    "motherPhone" TEXT,
    "motherEmail" TEXT,
    "fatherFirstName" TEXT,
    "fatherLastName" TEXT,
    "fatherBirthDate" TIMESTAMP(3),
    "fatherNationality" TEXT,
    "fatherCni" TEXT,
    "fatherProfession" TEXT,
    "fatherAddress" TEXT,
    "fatherPhone" TEXT,
    "parentsMarried" BOOLEAN NOT NULL DEFAULT false,
    "marriageCertNumber" TEXT,
    "marriageDate" TIMESTAMP(3),
    "declineReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "certificateNumber" TEXT,
    "hospitalId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "cityHallId" TEXT,
    "secretaireId" TEXT,
    "maireId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BirthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BirthRecord_certificateNumber_key" ON "BirthRecord"("certificateNumber");

-- AddForeignKey
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_cityHallId_fkey" FOREIGN KEY ("cityHallId") REFERENCES "CityHall"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_secretaireId_fkey" FOREIGN KEY ("secretaireId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BirthRecord" ADD CONSTRAINT "BirthRecord_maireId_fkey" FOREIGN KEY ("maireId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
