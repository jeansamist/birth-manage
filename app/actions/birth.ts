"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { birthFormSchema, type BirthFormInput } from "@/lib/schemas/birth"
import type { ActionResult } from "@/types/birth"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDateField(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function generateCertificateNumber(cityHallId: string): string {
  const year = new Date().getFullYear()
  const seq = Math.floor(100000 + Math.random() * 900000)
  const code = cityHallId.slice(-4).toUpperCase()
  return `ACN-${year}-${code}-${seq}`
}

// ─── Doctor actions ───────────────────────────────────────────────────────────

export async function saveBirthDraft(
  data: Partial<BirthFormInput>,
  existingId?: string,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") {
    return { success: false, error: "Non autorisé." }
  }

  const payload = {
    babyFirstName: data.babyFirstName ?? null,
    babyLastName: data.babyLastName ?? null,
    babyGender: (data.babyGender as "MALE" | "FEMALE" | undefined) ?? null,
    birthDate: parseDateField(data.birthDate),
    birthTime: data.birthTime ?? null,
    birthPlace: data.birthPlace ?? null,
    weightGrams: data.weightGrams ?? null,
    heightCm: data.heightCm ?? null,
    apgarScore: data.apgarScore ?? null,
    deliveryType: (data.deliveryType as any) ?? null,
    medicalNotes: data.medicalNotes ?? null,
    motherFirstName: data.motherFirstName ?? null,
    motherLastName: data.motherLastName ?? null,
    motherBirthDate: parseDateField(data.motherBirthDate),
    motherNationality: data.motherNationality ?? null,
    motherCni: data.motherCni ?? null,
    motherProfession: data.motherProfession ?? null,
    motherAddress: data.motherAddress ?? null,
    motherPhone: data.motherPhone ?? null,
    motherEmail: data.motherEmail || null,
    fatherFirstName: data.fatherFirstName ?? null,
    fatherLastName: data.fatherLastName ?? null,
    fatherBirthDate: parseDateField(data.fatherBirthDate),
    fatherNationality: data.fatherNationality ?? null,
    fatherCni: data.fatherCni ?? null,
    fatherProfession: data.fatherProfession ?? null,
    fatherAddress: data.fatherAddress ?? null,
    fatherPhone: data.fatherPhone ?? null,
    parentsMarried: data.parentsMarried ?? false,
    marriageCertNumber: data.marriageCertNumber ?? null,
    marriageDate: parseDateField(data.marriageDate),
  }

  if (existingId) {
    await prisma.birthRecord.update({ where: { id: existingId }, data: payload })
    return { success: true, id: existingId }
  }

  const assignment = await prisma.doctorHospitalAssignment.findFirst({
    where: { userId: session.userId, isApproved: true },
  })
  if (!assignment) {
    return { success: false, error: "Aucun hôpital approuvé trouvé pour ce médecin." }
  }

  const record = await prisma.birthRecord.create({
    data: {
      ...payload,
      status: "DRAFT",
      doctorId: session.userId,
      hospitalId: assignment.hospitalId,
    },
  })
  return { success: true, id: record.id }
}

export async function submitBirthToCityHall(
  data: BirthFormInput,
  existingId?: string,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") {
    return { success: false, error: "Non autorisé." }
  }

  const parsed = birthFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { cityHallId, ...rest } = parsed.data

  const payload = {
    babyFirstName: rest.babyFirstName,
    babyLastName: rest.babyLastName,
    babyGender: rest.babyGender as "MALE" | "FEMALE",
    birthDate: parseDateField(rest.birthDate),
    birthTime: rest.birthTime ?? null,
    birthPlace: rest.birthPlace ?? null,
    weightGrams: rest.weightGrams ?? null,
    heightCm: rest.heightCm ?? null,
    apgarScore: rest.apgarScore ?? null,
    deliveryType: (rest.deliveryType as any) ?? null,
    medicalNotes: rest.medicalNotes ?? null,
    motherFirstName: rest.motherFirstName,
    motherLastName: rest.motherLastName,
    motherBirthDate: parseDateField(rest.motherBirthDate),
    motherNationality: rest.motherNationality ?? null,
    motherCni: rest.motherCni ?? null,
    motherProfession: rest.motherProfession ?? null,
    motherAddress: rest.motherAddress ?? null,
    motherPhone: rest.motherPhone ?? null,
    motherEmail: rest.motherEmail || null,
    fatherFirstName: rest.fatherFirstName ?? null,
    fatherLastName: rest.fatherLastName ?? null,
    fatherBirthDate: parseDateField(rest.fatherBirthDate),
    fatherNationality: rest.fatherNationality ?? null,
    fatherCni: rest.fatherCni ?? null,
    fatherProfession: rest.fatherProfession ?? null,
    fatherAddress: rest.fatherAddress ?? null,
    fatherPhone: rest.fatherPhone ?? null,
    parentsMarried: rest.parentsMarried,
    marriageCertNumber: rest.marriageCertNumber ?? null,
    marriageDate: parseDateField(rest.marriageDate),
    status: "SUBMITTED" as const,
    cityHallId,
  }

  if (existingId) {
    await prisma.birthRecord.update({ where: { id: existingId }, data: payload })
  } else {
    const assignment = await prisma.doctorHospitalAssignment.findFirst({
      where: { userId: session.userId, isApproved: true },
    })
    if (!assignment) {
      return { success: false, error: "Aucun hôpital approuvé trouvé." }
    }
    await prisma.birthRecord.create({
      data: { ...payload, doctorId: session.userId, hospitalId: assignment.hospitalId },
    })
  }

  redirect("/dashboard/hospital")
}

// ─── Secretaire actions ───────────────────────────────────────────────────────

export async function claimBirth(birthId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "SECRETAIRE") {
    return { success: false, error: "Non autorisé." }
  }

  await prisma.birthRecord.update({
    where: { id: birthId },
    data: { status: "PROCESSING", secretaireId: session.userId },
  })

  redirect(`/dashboard/city-hall/births/${birthId}`)
}

export async function completeBirthRecord(
  birthId: string,
  data: Partial<BirthFormInput>,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "SECRETAIRE") {
    return { success: false, error: "Non autorisé." }
  }

  await prisma.birthRecord.update({
    where: { id: birthId },
    data: {
      motherCni: data.motherCni ?? undefined,
      motherProfession: data.motherProfession ?? undefined,
      motherAddress: data.motherAddress ?? undefined,
      motherPhone: data.motherPhone ?? undefined,
      fatherFirstName: data.fatherFirstName ?? undefined,
      fatherLastName: data.fatherLastName ?? undefined,
      fatherCni: data.fatherCni ?? undefined,
      fatherProfession: data.fatherProfession ?? undefined,
      fatherAddress: data.fatherAddress ?? undefined,
      fatherPhone: data.fatherPhone ?? undefined,
      parentsMarried: data.parentsMarried ?? undefined,
      marriageCertNumber: data.marriageCertNumber ?? undefined,
      marriageDate: parseDateField(data.marriageDate),
    },
  })

  return { success: true, id: birthId }
}

export async function submitToMaire(birthId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "SECRETAIRE") {
    return { success: false, error: "Non autorisé." }
  }

  const birth = await prisma.birthRecord.findUnique({ where: { id: birthId } })
  if (!birth || birth.cityHallId !== session.institutionId) {
    return { success: false, error: "Dossier introuvable." }
  }

  await prisma.birthRecord.update({
    where: { id: birthId },
    data: { status: "PENDING_APPROVAL", secretaireId: session.userId },
  })

  redirect("/dashboard/city-hall")
}

// ─── Maire actions ────────────────────────────────────────────────────────────

export async function approveBirth(birthId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "MAIRE") {
    return { success: false, error: "Non autorisé." }
  }

  const birth = await prisma.birthRecord.findUnique({
    where: { id: birthId },
    include: { cityHall: true },
  })
  if (!birth) return { success: false, error: "Dossier introuvable." }

  const certificateNumber = generateCertificateNumber(birth.cityHallId!)

  await prisma.birthRecord.update({
    where: { id: birthId },
    data: {
      status: "APPROVED",
      maireId: session.userId,
      approvedAt: new Date(),
      certificateNumber,
    },
  })

  redirect("/dashboard/maire")
}

export async function declineBirth(
  birthId: string,
  reason: string,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== "MAIRE") {
    return { success: false, error: "Non autorisé." }
  }

  await prisma.birthRecord.update({
    where: { id: birthId },
    data: {
      status: "DECLINED",
      maireId: session.userId,
      declinedAt: new Date(),
      declineReason: reason,
    },
  })

  redirect("/dashboard/maire")
}
