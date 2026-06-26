import { prisma } from "@/lib/prisma"
import type { SessionPayload } from "@/types/auth"

/**
 * Seul le secretaire de la mairie detentrice de l'acte
 * (mairie d'origine ou mairie ayant recu une copie transferee) peut telecharger.
 */
export async function canDownloadCertificate(
  session: SessionPayload,
  birthId: string,
  cityHallId: string | null,
): Promise<boolean> {
  if (session.role !== "SECRETAIRE" || !session.institutionId) {
    if (session.role === "ADMIN") return true
    return false
  }

  if (cityHallId && session.institutionId === cityHallId) return true

  const copy = await prisma.birthRecordCopy.findUnique({
    where: {
      birthRecordId_cityHallId: {
        birthRecordId: birthId,
        cityHallId: session.institutionId,
      },
    },
  })

  return !!copy
}
