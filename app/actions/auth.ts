"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"
import { createSession, setSessionCookie } from "@/lib/auth"
import { loginSchema, type LoginInput } from "@/lib/schemas/auth"
import type { LoginResult } from "@/types/auth"

// ─── Unified login ────────────────────────────────────────────────────────────
// Un seul formulaire identifiant + mot de passe : le système déduit le rôle et
// l'institution depuis le compte. Un médecin rattaché à plusieurs hôpitaux
// approuvés doit choisir son hôpital (requiresHospitalChoice).

export async function login(data: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: { message: parsed.error.issues[0].message },
    }
  }

  const { username, password, hospitalId } = parsed.data

  const user = await prisma.user.findFirst({
    where: { username, isActive: true },
  })

  if (!user) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return { success: false, error: { message: "Identifiants invalides." } }
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  if (user.role === "ADMIN") {
    const token = await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
    })
    await setSessionCookie(token)
    redirect("/dashboard")
  }

  // ── Utilisateurs de mairie (Maire, Secrétaire, Mainteneur) ─────────────────
  if (["MAIRE", "SECRETAIRE", "MAINTAINER"].includes(user.role)) {
    if (!user.cityHallId) {
      return {
        success: false,
        error: { message: "Votre compte n'est rattaché à aucune mairie. Contactez l'administrateur." },
      }
    }
    const token = await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
      institutionId: user.cityHallId,
      institutionType: "city-hall",
    })
    await setSessionCookie(token)
    redirect("/dashboard")
  }

  // ── Médecin ────────────────────────────────────────────────────────────────
  const assignments = await prisma.doctorHospitalAssignment.findMany({
    where: {
      userId: user.id,
      isApproved: true,
      hospital: { isActive: true },
    },
    include: { hospital: { select: { id: true, name: true, city: true } } },
    orderBy: { approvedAt: "desc" },
  })

  if (assignments.length === 0) {
    return {
      success: false,
      error: { message: "Votre compte n'est encore approuvé dans aucun hôpital." },
    }
  }

  let selectedHospitalId: string
  if (assignments.length === 1) {
    selectedHospitalId = assignments[0].hospitalId
  } else if (hospitalId) {
    if (!assignments.some((a) => a.hospitalId === hospitalId)) {
      return { success: false, error: { message: "Hôpital invalide pour ce compte." } }
    }
    selectedHospitalId = hospitalId
  } else {
    // Plusieurs hôpitaux approuvés : le médecin doit choisir
    return {
      success: true,
      requiresHospitalChoice: true,
      hospitals: assignments.map((a) => a.hospital),
    }
  }

  const token = await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: selectedHospitalId,
    institutionType: "hospital",
  })
  await setSessionCookie(token)
  redirect("/dashboard")
}
