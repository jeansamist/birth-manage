import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Mot de passe généré pour les comptes créés depuis le portail admin —
// affiché une seule fois à l'admin juste après la création.
export function generatePassword(): string {
  return crypto.randomBytes(9).toString("base64url")
}
