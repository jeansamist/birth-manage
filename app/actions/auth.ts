"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"
import { createSession, setSessionCookie } from "@/lib/auth"
import {
  hospitalLoginSchema,
  cityHallLoginSchema,
  adminLoginSchema,
  type HospitalLoginInput,
  type CityHallLoginInput,
  type AdminLoginInput,
} from "@/lib/schemas/auth"
import type { LoginResult } from "@/types/auth"

// ─── Hospital (Doctor) login ──────────────────────────────────────────────────

export async function loginAsDoctor(
  data: HospitalLoginInput,
): Promise<LoginResult> {
  const parsed = hospitalLoginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: { message: parsed.error.issues[0].message },
    }
  }

  const { hospitalId, username, password } = parsed.data

  const user = await prisma.user.findFirst({
    where: {
      username,
      role: "DOCTOR",
      isActive: true,
      hospitalAssignments: {
        some: { hospitalId, isApproved: true },
      },
    },
  })

  if (!user) {
    return {
      success: false,
      error: {
        message:
          "Identifiants invalides ou compte non approuvé dans cet hôpital.",
      },
    }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  const token = await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: hospitalId,
    institutionType: "hospital",
  })
  await setSessionCookie(token)
  redirect("/dashboard")
}

// ─── City Hall login ──────────────────────────────────────────────────────────

export async function loginAsCityHallUser(
  data: CityHallLoginInput,
): Promise<LoginResult> {
  const parsed = cityHallLoginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: { message: parsed.error.issues[0].message },
    }
  }

  const { cityHallId, username, password } = parsed.data

  const user = await prisma.user.findFirst({
    where: {
      username,
      cityHallId,
      role: { in: ["MAIRE", "SECRETAIRE", "MAINTAINER"] },
      isActive: true,
    },
  })

  if (!user) {
    return {
      success: false,
      error: {
        message:
          "Identifiants invalides ou compte introuvable dans cette mairie.",
      },
    }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  const token = await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: cityHallId,
    institutionType: "city-hall",
  })
  await setSessionCookie(token)
  redirect("/dashboard")
}

// ─── Admin login ──────────────────────────────────────────────────────────────

export async function loginAsAdmin(
  data: AdminLoginInput,
): Promise<LoginResult> {
  const parsed = adminLoginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: { message: parsed.error.issues[0].message },
    }
  }

  const { username, password } = parsed.data

  const user = await prisma.user.findFirst({
    where: { username, role: "ADMIN", isActive: true },
  })

  if (!user) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  const token = await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
  })
  await setSessionCookie(token)
  redirect("/dashboard")
}
