import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  const [
    hospitals,
    cityHalls,
    users,
    doctors,
    pendingDoctors,
    births,
    approvedBirths,
    pendingTransfers,
  ] = await Promise.all([
    prisma.hospital.count(),
    prisma.cityHall.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "DOCTOR" } }),
    prisma.doctorHospitalAssignment.count({ where: { isApproved: false } }),
    prisma.birthRecord.count(),
    prisma.birthRecord.count({ where: { status: "APPROVED" } }),
    prisma.transferRequest.count({ where: { status: "PENDING" } }),
  ])

  const birthsByStatus = await prisma.birthRecord.groupBy({
    by: ["status"],
    _count: { id: true },
  })

  return {
    hospitals,
    cityHalls,
    users,
    doctors,
    pendingDoctors,
    births,
    approvedBirths,
    pendingTransfers,
    birthsByStatus: Object.fromEntries(
      birthsByStatus.map((b) => [b.status, b._count.id]),
    ) as Record<string, number>,
  }
}
