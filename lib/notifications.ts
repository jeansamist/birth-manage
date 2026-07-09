import { prisma } from "@/lib/prisma"
import type { $Enums } from "@/generated/prisma/client"

type NotificationType = $Enums.NotificationType
type UserRole = $Enums.UserRole

interface NotifyParams {
  userIds: string[]
  type: NotificationType
  title: string
  message: string
  link?: string
}

async function notify({ userIds, type, title, message, link }: NotifyParams): Promise<void> {
  const ids = [...new Set(userIds)]
  if (ids.length === 0) return
  await prisma.notification.createMany({
    data: ids.map((userId) => ({ userId, type, title, message, link })),
  })
}

async function cityHallStaffIds(cityHallId: string, roles: UserRole[]): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { cityHallId, role: { in: roles }, isActive: true },
    select: { id: true },
  })
  return users.map((u) => u.id)
}

// ─── Cycle de vie d'un dossier de naissance ────────────────────────────────────

export async function notifyBirthSubmitted(params: {
  cityHallId: string
  hospitalName: string
  childLabel: string
  birthId: string
}): Promise<void> {
  const userIds = await cityHallStaffIds(params.cityHallId, ["SECRETAIRE", "MAINTAINER"])
  await notify({
    userIds,
    type: "BIRTH_SUBMITTED",
    title: "Nouveau dossier reçu",
    message: `${params.hospitalName} a soumis le dossier de ${params.childLabel}.`,
    link: `/dashboard/city-hall/births/${params.birthId}/details`,
  })
}

export async function notifyBirthPendingApproval(params: {
  cityHallId: string
  secretaireName: string
  childLabel: string
  birthId: string
}): Promise<void> {
  const userIds = await cityHallStaffIds(params.cityHallId, ["MAIRE"])
  await notify({
    userIds,
    type: "BIRTH_PENDING_APPROVAL",
    title: "Dossier soumis pour signature",
    message: `${params.secretaireName} a soumis le dossier de ${params.childLabel} pour votre approbation.`,
    link: `/dashboard/maire/births/${params.birthId}`,
  })
}

export async function notifyBirthApproved(params: {
  cityHallId: string
  secretaireId: string | null
  childLabel: string
  birthId: string
}): Promise<void> {
  const maintainers = await cityHallStaffIds(params.cityHallId, ["MAINTAINER"])
  const userIds = params.secretaireId ? [params.secretaireId, ...maintainers] : maintainers
  await notify({
    userIds,
    type: "BIRTH_APPROVED",
    title: "Acte approuvé et signé",
    message: `Le maire a signé l'acte de naissance de ${params.childLabel}.`,
    link: `/dashboard/city-hall/births/${params.birthId}/view`,
  })
}

export async function notifyBirthDeclined(params: {
  cityHallId: string
  secretaireId: string | null
  childLabel: string
  birthId: string
  reason: string
}): Promise<void> {
  const maintainers = await cityHallStaffIds(params.cityHallId, ["MAINTAINER"])
  const userIds = params.secretaireId ? [params.secretaireId, ...maintainers] : maintainers
  await notify({
    userIds,
    type: "BIRTH_DECLINED",
    title: "Dossier refusé par le maire",
    message: `Le dossier de ${params.childLabel} a été refusé : ${params.reason}`,
    link: `/dashboard/city-hall/births/${params.birthId}/details`,
  })
}

// ─── Transferts de copies entre mairies ────────────────────────────────────────

export async function notifyTransferRequested(params: {
  sourceCityHallId: string
  childLabel: string
  targetCityHallName: string
}): Promise<void> {
  const userIds = await cityHallStaffIds(params.sourceCityHallId, ["MAIRE"])
  await notify({
    userIds,
    type: "TRANSFER_REQUESTED",
    title: "Nouvelle demande de transfert",
    message: `Un citoyen demande le transfert de l'acte de ${params.childLabel} vers ${params.targetCityHallName}.`,
    link: `/dashboard/maire?section=transfers`,
  })
}

export async function notifyTransferApproved(params: {
  targetCityHallId: string
  childLabel: string
  birthId: string
}): Promise<void> {
  const userIds = await cityHallStaffIds(params.targetCityHallId, ["SECRETAIRE", "MAINTAINER"])
  await notify({
    userIds,
    type: "TRANSFER_APPROVED",
    title: "Nouvelle copie d'acte disponible",
    message: `Une copie de l'acte de ${params.childLabel} a été transférée vers votre mairie.`,
    link: `/dashboard/city-hall/births/${params.birthId}/view`,
  })
}
