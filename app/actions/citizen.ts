"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
function normalizeAccessId(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
}

function redirectToPortal(
  accessId: string,
  params: Record<string, string>
): never {
  const search = new URLSearchParams({ code: accessId, ...params })
  redirect(`/citizen?${search.toString()}`)
}

export async function findCitizenRecord(formData: FormData): Promise<void> {
  const accessId = normalizeAccessId(formData.get("accessId"))
  const motherLastName = String(formData.get("motherLastName") ?? "").trim().toUpperCase()
  
  if (!accessId || !motherLastName) {
    redirect("/citizen?error=missing-fields")
  }

  redirect(`/citizen?code=${encodeURIComponent(accessId)}&mother=${encodeURIComponent(motherLastName)}`)
}

export async function requestBirthTransfer(formData: FormData): Promise<void> {
  const certificateNumber = normalizeAccessId(formData.get("accessId"))
  const targetCityHallId = String(formData.get("targetCityHallId") ?? "").trim()
  const requesterName = String(formData.get("requesterName") ?? "").trim()
  const requesterCni = String(formData.get("requesterCni") ?? "").trim()
  const idCardRecto = String(formData.get("idCardRecto") ?? "").trim()
  const idCardVerso = String(formData.get("idCardVerso") ?? "").trim()
  const requesterPhone = String(formData.get("requesterPhone") ?? "").trim()
  const reason = String(formData.get("reason") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!certificateNumber || !targetCityHallId || !requesterName || !requesterCni || !idCardRecto || !idCardVerso) {
    redirectToPortal(certificateNumber, { error: "missing-fields" })
  }

  const birth = await prisma.birthRecord.findUnique({
    where: { certificateNumber },
    include: { copies: true },
  })
  if (!birth || birth.status !== "APPROVED" || !birth.cityHallId) {
    redirectToPortal(certificateNumber, { error: "not-found" })
  }

  if (targetCityHallId === birth.cityHallId) {
    redirectToPortal(certificateNumber, { error: "same-city-hall" })
  }

  const targetCityHall = await prisma.cityHall.findUnique({
    where: { id: targetCityHallId },
    select: { id: true, isActive: true },
  })
  if (!targetCityHall?.isActive) {
    redirectToPortal(certificateNumber, { error: "target-not-found" })
  }

  const alreadyAvailable = birth.copies.some(
    (copy) => copy.cityHallId === targetCityHallId
  )
  if (alreadyAvailable) {
    redirectToPortal(certificateNumber, { success: "already-available" })
  }

  const pendingRequest = await prisma.transferRequest.findFirst({
    where: {
      birthRecordId: birth.id,
      targetCityHallId,
      status: "PENDING",
    },
    select: { id: true },
  })
  if (pendingRequest) {
    redirectToPortal(certificateNumber, { success: "pending" })
  }

  await prisma.transferRequest.create({
    data: {
      birthRecordId: birth.id,
      sourceCityHallId: birth.cityHallId,
      targetCityHallId,
      requesterName,
      requesterPhone: requesterPhone || null,
      requesterCni,
      idCardRecto,
      idCardVerso,
      reason: reason || null,
      message: message || null,
    },
  })

  redirectToPortal(certificateNumber, { success: "request-created" })
}

export async function finalizeCitizenDeclaration(id: string, data: any): Promise<void> {
  const motherBirthDate = data.motherBirthDate ? new Date(data.motherBirthDate) : null
  const fatherBirthDate = data.fatherBirthDate ? new Date(data.fatherBirthDate) : null
  const marriageDate = data.marriageDate ? new Date(data.marriageDate) : null

  await prisma.birthRecord.update({
    where: { id },
    data: {
      motherProfession: data.motherProfession || null,
      motherNationality: data.motherNationality || null,
      motherCni: data.motherCni || null,
      motherAddress: data.motherAddress || null,
      motherPhone: data.motherPhone || null,

      fatherFirstName: data.fatherFirstName || null,
      fatherLastName: data.fatherLastName || null,
      fatherBirthDate: fatherBirthDate,
      fatherNationality: data.fatherNationality || null,
      fatherProfession: data.fatherProfession || null,
      fatherCni: data.fatherCni || null,
      fatherAddress: data.fatherAddress || null,
      fatherPhone: data.fatherPhone || null,

      parentsMarried: data.parentsMarried || false,
      marriageCertNumber: data.marriageCertNumber || null,
      marriageDate: marriageDate,

      isCompletedByCitizen: true,
      status: "SUBMITTED",
    },
  })
}

export async function submitCitizenDeclaration(data: any): Promise<{ trackingCode: string }> {
  // Generate random tracking code and access ID
  const trackingCode = `TRK-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  const accessId = `CID-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`

  // Fetch a default hospital and doctor to satisfy database relations
  const hospital = await prisma.hospital.findFirst({ where: { isActive: true } })
  const doctor = await prisma.user.findFirst({ where: { role: "DOCTOR", isActive: true } })

  if (!hospital || !doctor) {
    throw new Error("No active hospital or doctor found to assign the declaration.")
  }

  const birthDate = data.birthDate ? new Date(data.birthDate) : null
  const motherBirthDate = data.motherBirthDate ? new Date(data.motherBirthDate) : null
  const fatherBirthDate = data.fatherBirthDate ? new Date(data.fatherBirthDate) : null
  const marriageDate = data.marriageDate ? new Date(data.marriageDate) : null

  await prisma.birthRecord.create({
    data: {
      babyFirstName: data.babyFirstName || null,
      babyLastName: data.babyLastName || null,
      babyGender: data.babyGender || null,
      birthDate: birthDate,
      birthTime: data.birthTime || null,
      birthPlace: data.birthPlace || null,

      weightGrams: data.weightGrams ? Number(data.weightGrams) : null,
      heightCm: data.heightCm ? Number(data.heightCm) : null,
      apgarScore: data.apgarScore ? Number(data.apgarScore) : null,
      deliveryType: "NATURAL",

      motherFirstName: data.motherFirstName || null,
      motherLastName: data.motherLastName || null,
      motherBirthDate: motherBirthDate,
      motherNationality: data.motherNationality || "Camerounaise",
      motherCni: data.motherCni || null,
      motherProfession: data.motherProfession || null,
      motherAddress: data.motherAddress || null,
      motherPhone: data.motherPhone || null,
      motherEmail: data.motherEmail || null,

      fatherFirstName: data.fatherFirstName || null,
      fatherLastName: data.fatherLastName || null,
      fatherBirthDate: fatherBirthDate,
      fatherNationality: data.fatherNationality || "Camerounaise",
      fatherProfession: data.fatherProfession || null,
      fatherCni: data.fatherCni || null,
      fatherAddress: data.fatherAddress || null,
      fatherPhone: data.fatherPhone || null,

      parentsMarried: data.parentsMarried || false,
      marriageCertNumber: data.marriageCertNumber || null,
      marriageDate: marriageDate,

      cityHallId: data.cityHallId,
      hospitalId: hospital.id,
      doctorId: doctor.id,

      citizenTrackingCode: trackingCode,
      citizenAccessId: accessId,
      isCompletedByCitizen: true,
      status: "SUBMITTED",
    },
  })

  return { trackingCode }
}

