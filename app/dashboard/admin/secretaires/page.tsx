import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StaffTable } from "@/app/dashboard/admin/_components/staff-table"

export default async function AdminSecretairesPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  const [secretaires, cityHalls] = await Promise.all([
    prisma.user.findMany({
      where: { role: "SECRETAIRE" },
      include: { cityHall: { select: { name: true } } },
      orderBy: { lastName: "asc" },
    }),
    prisma.cityHall.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">Secrétaires</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Gérez les comptes des secrétaires d'état civil.
        </p>
      </div>
      <StaffTable role="SECRETAIRE" rows={secretaires} cityHalls={cityHalls} />
    </div>
  )
}
