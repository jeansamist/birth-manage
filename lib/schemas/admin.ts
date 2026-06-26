import { z } from "zod"

export const institutionSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  city: z.string().min(2, "Ville requise"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

export const userSchema = z.object({
  username: z.string().min(3, "Identifiant requis (min. 3 caractères)"),
  password: z.string().min(8, "Mot de passe requis (min. 8 caractères)").optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  role: z.enum(["ADMIN", "DOCTOR", "MAIRE", "SECRETAIRE", "MAINTAINER"]),
  cityHallId: z.string().optional(),
  hospitalId: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type InstitutionInput = z.infer<typeof institutionSchema>
export type UserInput = z.infer<typeof userSchema>
