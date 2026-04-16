import { z } from "zod"

// ─── Shared fields ────────────────────────────────────────────────────────────

const credentials = {
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
}

// ─── Hospital (Doctor) login ──────────────────────────────────────────────────

export const hospitalLoginSchema = z.object({
  hospitalId: z.string().min(1, "Veuillez sélectionner un hôpital"),
  ...credentials,
})

export type HospitalLoginInput = z.infer<typeof hospitalLoginSchema>

// ─── City Hall login ──────────────────────────────────────────────────────────

export const cityHallLoginSchema = z.object({
  cityHallId: z.string().min(1, "Veuillez sélectionner une mairie"),
  ...credentials,
})

export type CityHallLoginInput = z.infer<typeof cityHallLoginSchema>

// ─── Admin login ──────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  ...credentials,
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

// ─── Shared credentials schema (client-side form) ─────────────────────────────

export const credentialsSchema = z.object({
  ...credentials,
})

export type CredentialsInput = z.infer<typeof credentialsSchema>
