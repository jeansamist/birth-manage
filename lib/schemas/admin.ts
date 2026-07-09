import { z } from "zod"

// ─── Institutions (Mairie / Hôpital — champs identiques) ──────────────────────

export const institutionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  city: z.string().min(1, "La ville est requise"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
})

export type InstitutionInput = z.infer<typeof institutionSchema>

// ─── Personnel de mairie (Maire / Secrétaire) ──────────────────────────────────

export const staffCreateSchema = z.object({
  username: z.string().min(3, "3 caractères minimum"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  cityHallId: z.string().min(1, "La mairie est requise"),
})

export type StaffCreateInput = z.infer<typeof staffCreateSchema>

export const staffUpdateSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  cityHallId: z.string().min(1, "La mairie est requise"),
})

export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>

// ─── Médecins ───────────────────────────────────────────────────────────────

export const doctorCreateSchema = z.object({
  username: z.string().min(3, "3 caractères minimum"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  hospitalId: z.string().min(1, "L'hôpital est requis"),
})

export type DoctorCreateInput = z.infer<typeof doctorCreateSchema>

export const doctorUpdateSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
})

export type DoctorUpdateInput = z.infer<typeof doctorUpdateSchema>
