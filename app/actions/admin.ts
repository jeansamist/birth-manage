"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { hashPassword, generatePassword } from "@/lib/password"
import {
  institutionSchema,
  staffCreateSchema,
  staffUpdateSchema,
  doctorCreateSchema,
  doctorUpdateSchema,
  type InstitutionInput,
  type StaffCreateInput,
  type StaffUpdateInput,
  type DoctorCreateInput,
  type DoctorUpdateInput,
} from "@/lib/schemas/admin"

// ─── Result types ─────────────────────────────────────────────────────────────

interface ActionError {
  message: string
  field?: string
}

interface ActionResult {
  success: boolean
  error?: ActionError
}

interface CredentialsResult extends ActionResult {
  username?: string
  generatedPassword?: string
}

// ─── Guard ────────────────────────────────────────────────────────────────────
// Chaque server action est un endpoint appelable indépendamment des pages ; la
// vérification côté page (redirect) ne suffit pas, il faut la revalider ici.

async function assertAdmin() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return session
}

function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  )
}

// ─── Mairies ──────────────────────────────────────────────────────────────────

export async function createCityHall(data: InstitutionInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = institutionSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.cityHall.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  })
  return { success: true }
}

export async function updateCityHall(id: string, data: InstitutionInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = institutionSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.cityHall.update({
    where: { id },
    data: { ...parsed.data, email: parsed.data.email || null },
  })
  return { success: true }
}

// ─── Hôpitaux ─────────────────────────────────────────────────────────────────

export async function createHospital(data: InstitutionInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = institutionSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.hospital.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  })
  return { success: true }
}

export async function updateHospital(id: string, data: InstitutionInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = institutionSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.hospital.update({
    where: { id },
    data: { ...parsed.data, email: parsed.data.email || null },
  })
  return { success: true }
}

// ─── Activation / désactivation (mairie, hôpital, utilisateur) ────────────────

type ToggleableEntity = "cityHall" | "hospital" | "user"

export async function setEntityActive(
  entity: ToggleableEntity,
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await assertAdmin()

  if (entity === "cityHall") {
    await prisma.cityHall.update({ where: { id }, data: { isActive } })
  } else if (entity === "hospital") {
    await prisma.hospital.update({ where: { id }, data: { isActive } })
  } else {
    await prisma.user.update({ where: { id }, data: { isActive } })
  }
  return { success: true }
}

// ─── Personnel de mairie (Maire / Secrétaire) ──────────────────────────────────

export async function createStaff(
  role: "MAIRE" | "SECRETAIRE",
  data: StaffCreateInput,
): Promise<CredentialsResult> {
  await assertAdmin()
  const parsed = staffCreateSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  const generatedPassword = generatePassword()
  const password = await hashPassword(generatedPassword)

  try {
    const user = await prisma.user.create({
      data: {
        username: parsed.data.username,
        password,
        email: parsed.data.email || null,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        role,
        cityHallId: parsed.data.cityHallId,
      },
    })
    return { success: true, username: user.username, generatedPassword }
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return {
        success: false,
        error: { field: "username", message: "Ce nom d'utilisateur est déjà utilisé." },
      }
    }
    throw err
  }
}

export async function updateStaff(id: string, data: StaffUpdateInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = staffUpdateSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.user.update({
    where: { id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || null,
      cityHallId: parsed.data.cityHallId,
    },
  })
  return { success: true }
}

// ─── Médecins ───────────────────────────────────────────────────────────────

export async function createDoctor(data: DoctorCreateInput): Promise<CredentialsResult> {
  await assertAdmin()
  const parsed = doctorCreateSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  const generatedPassword = generatePassword()
  const password = await hashPassword(generatedPassword)

  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          username: parsed.data.username,
          password,
          email: parsed.data.email || null,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          role: "DOCTOR",
        },
      })
      await tx.doctorHospitalAssignment.create({
        data: {
          userId: created.id,
          hospitalId: parsed.data.hospitalId,
          isApproved: true,
          approvedAt: new Date(),
        },
      })
      return created
    })
    return { success: true, username: user.username, generatedPassword }
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return {
        success: false,
        error: { field: "username", message: "Ce nom d'utilisateur est déjà utilisé." },
      }
    }
    throw err
  }
}

export async function updateDoctor(id: string, data: DoctorUpdateInput): Promise<ActionResult> {
  await assertAdmin()
  const parsed = doctorUpdateSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: { message: parsed.error.issues[0].message } }
  }

  await prisma.user.update({
    where: { id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || null,
    },
  })
  return { success: true }
}

// ─── Régénération de mot de passe (maire / secrétaire / médecin) ──────────────

export async function regeneratePassword(userId: string): Promise<CredentialsResult> {
  await assertAdmin()

  const generatedPassword = generatePassword()
  const password = await hashPassword(generatedPassword)
  const user = await prisma.user.update({
    where: { id: userId },
    data: { password },
  })
  return { success: true, username: user.username, generatedPassword }
}
