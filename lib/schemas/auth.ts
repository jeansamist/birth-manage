import { z } from "zod"

// ─── Shared fields ────────────────────────────────────────────────────────────

const credentials = {
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
}

// ─── Unified login ────────────────────────────────────────────────────────────
// hospitalId n'est fourni que lorsqu'un médecin rattaché à plusieurs hôpitaux
// choisit son établissement après vérification de ses identifiants.

export const loginSchema = z.object({
  ...credentials,
  hospitalId: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

// ─── Shared credentials schema (client-side form) ─────────────────────────────

export const credentialsSchema = z.object({
  ...credentials,
})

export type CredentialsInput = z.infer<typeof credentialsSchema>
