import { prisma } from "@/lib/prisma"

export async function getCityHallInboxCounts(cityHallId: string) {
  const [submitted, processing, pendingApproval] = await Promise.all([
    prisma.birthRecord.count({
      where: { cityHallId, status: "SUBMITTED" },
    }),
    prisma.birthRecord.count({
      where: { cityHallId, status: "PROCESSING" },
    }),
    prisma.birthRecord.count({
      where: { cityHallId, status: "PENDING_APPROVAL" },
    }),
  ])

  return { submitted, processing, pendingApproval }
}

export async function getSubmittedBirths(cityHallId: string) {
  return prisma.birthRecord.findMany({
    where: { cityHallId, status: "SUBMITTED" },
    orderBy: { updatedAt: "desc" },
    include: { hospital: { select: { name: true, city: true } } },
  })
}
