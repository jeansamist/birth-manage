"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { hashPassword } from "@/lib/password"
import { institutionSchema, userSchema } from "@/lib/schemas/admin"
import type { ActionResult } from "@/types/birth"

async function adminGuard() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return null
  }
  return session
}

function revalidateAdmin() {
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/hospitals")
  revalidatePath("/dashboard/admin/city-halls")
  revalidatePath("/dashboard/admin/users")
  revalidatePath("/dashboard/admin/doctors")
  revalidatePath("/dashboard/admin/births")
  revalidatePath("/dashboard/admin/transfers")
}

// ─── Hospitals ────────────────────────────────────────────────────────────────

export async function createHospital(formData: FormData): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = institutionSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const hospital = await prisma.hospital.create({ data: parsed.data })
  revalidateAdmin()
  redirect(`/dashboard/admin/hospitals/${hospital.id}`)
}

export async function updateHospital(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = institutionSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  await prisma.hospital.update({ where: { id }, data: parsed.data })
  revalidateAdmin()
  redirect("/dashboard/admin/hospitals")
}

// ─── City halls ───────────────────────────────────────────────────────────────

export async function createCityHall(formData: FormData): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = institutionSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const cityHall = await prisma.cityHall.create({ data: parsed.data })
  revalidateAdmin()
  redirect(`/dashboard/admin/city-halls/${cityHall.id}`)
}

export async function updateCityHall(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = institutionSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  await prisma.cityHall.update({ where: { id }, data: parsed.data })
  revalidateAdmin()
  redirect("/dashboard/admin/city-halls")
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUser(formData: FormData): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = userSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email") || undefined,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
    cityHallId: formData.get("cityHallId") || undefined,
    hospitalId: formData.get("hospitalId") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  if (!parsed.data.password) {
    return { success: false, error: "Mot de passe requis pour un nouvel utilisateur." }
  }

  const { hospitalId, password, cityHallId, role, ...userData } = parsed.data
  const needsCityHall = ["MAIRE", "SECRETAIRE", "MAINTAINER"].includes(role)
  const needsHospital = role === "DOCTOR"

  if (needsCityHall && !cityHallId) {
    return { success: false, error: "Mairie requise pour ce rôle." }
  }
  if (needsHospital && !hospitalId) {
    return { success: false, error: "Hôpital requis pour un médecin." }
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      ...userData,
      role,
      password: hashed,
      cityHallId: needsCityHall ? cityHallId : null,
    },
  })

  if (role === "DOCTOR" && hospitalId) {
    await prisma.doctorHospitalAssignment.create({
      data: {
        userId: user.id,
        hospitalId,
        isApproved: true,
        approvedAt: new Date(),
      },
    })
  }

  revalidateAdmin()
  redirect(`/dashboard/admin/users/${user.id}`)
}

export async function updateUser(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await adminGuard())) return { success: false, error: "Non autorisé." }

  const parsed = userSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password") || undefined,
    email: formData.get("email") || undefined,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
    cityHallId: formData.get("cityHallId") || undefined,
    isActive: formData.get("isActive") === "on",
  })
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { password, cityHallId, role, ...userData } = parsed.data
  const needsCityHall = ["MAIRE", "SECRETAIRE", "MAINTAINER"].includes(role)

  await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      role,
      cityHallId: needsCityHall ? cityHallId ?? null : null,
      ...(password ? { password: await hashPassword(password) } : {}),
    },
  })

  revalidateAdmin()
  redirect("/dashboard/admin/users")
}

// ─── Doctor approvals ─────────────────────────────────────────────────────────

export async function approveDoctorAssignment(assignmentId: string): Promise<void> {
  if (!(await adminGuard())) redirect("/dashboard")

  await prisma.doctorHospitalAssignment.update({
    where: { id: assignmentId },
    data: { isApproved: true, approvedAt: new Date() },
  })

  revalidateAdmin()
  redirect("/dashboard/admin/doctors")
}

export async function revokeDoctorAssignment(assignmentId: string): Promise<void> {
  if (!(await adminGuard())) redirect("/dashboard")

  await prisma.doctorHospitalAssignment.update({
    where: { id: assignmentId },
    data: { isApproved: false, approvedAt: null },
  })

  revalidateAdmin()
  redirect("/dashboard/admin/doctors")
}
