import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StaffTable } from "@/app/dashboard/admin/_components/staff-table"

export default async function AdminMairesPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  const [maires, cityHalls] = await Promise.all([
    prisma.user.findMany({
      where: { role: "MAIRE" },
      include: { cityHall: { select: { name: true } } },
      orderBy: { lastName: "asc" },
    }),
    prisma.cityHall.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Maires</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Gérez les comptes des officiers d'état civil / maires.
        </p>
      </div>
      <StaffTable role="MAIRE" rows={maires} cityHalls={cityHalls} />
    </div>
  )
}
