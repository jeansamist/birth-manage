// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "ADMIN"
  | "DOCTOR"
  | "MAIRE"
  | "SECRETAIRE"
  | "MAINTAINER"

export type LoginType = "hospital" | "city-hall" | "admin"

// ─── Session ──────────────────────────────────────────────────────────────────

export interface SessionPayload {
  userId: string
  username: string
  role: UserRole
  institutionId?: string
  institutionType?: "hospital" | "city-hall"
}

// ─── Institution options (for select dropdowns) ───────────────────────────────

export interface HospitalOption {
  id: string
  name: string
  city: string
}

export interface CityHallOption {
  id: string
  name: string
  city: string
}

// ─── Action results ───────────────────────────────────────────────────────────

export interface AuthError {
  message: string
  field?: string
}

export interface LoginResult {
  success: boolean
  error?: AuthError
}
