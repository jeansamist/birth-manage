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
  const accessId = normalizeAccessId(formData.get("accessId"))
  const targetCityHallId = String(formData.get("targetCityHallId") ?? "").trim()
  const requesterName = String(formData.get("requesterName") ?? "").trim()
  const requesterPhone = String(formData.get("requesterPhone") ?? "").trim()
  const reason = String(formData.get("reason") ?? "").trim()

  if (!accessId || !targetCityHallId || !requesterName) {
    redirectToPortal(accessId, { error: "missing-fields" })
  }

  const birth = await prisma.birthRecord.findUnique({
    where: { citizenAccessId: accessId },
    include: { copies: true },
  })
  if (!birth || birth.status !== "APPROVED" || !birth.cityHallId) {
    redirectToPortal(accessId, { error: "not-found" })
  }

  if (targetCityHallId === birth.cityHallId) {
    redirectToPortal(accessId, { error: "same-city-hall" })
  }

  const targetCityHall = await prisma.cityHall.findUnique({
    where: { id: targetCityHallId },
    select: { id: true, isActive: true },
  })
  if (!targetCityHall?.isActive) {
    redirectToPortal(accessId, { error: "target-not-found" })
  }

  const alreadyAvailable = birth.copies.some(
    (copy) => copy.cityHallId === targetCityHallId
  )
  if (alreadyAvailable) {
    redirectToPortal(accessId, { success: "already-available" })
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
    redirectToPortal(accessId, { success: "pending" })
  }

  await prisma.transferRequest.create({
    data: {
      birthRecordId: birth.id,
      sourceCityHallId: birth.cityHallId,
      targetCityHallId,
      requesterName,
      requesterPhone: requesterPhone || null,
      reason: reason || null,
    },
  })

  redirectToPortal(accessId, { success: "request-created" })
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
