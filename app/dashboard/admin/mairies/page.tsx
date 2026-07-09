import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InstitutionTable } from "@/app/dashboard/admin/_components/institution-table"

export default async function AdminMairiesPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  const cityHalls = await prisma.cityHall.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">Mairies</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Gérez les mairies rattachées au système d'état civil.
        </p>
      </div>
      <InstitutionTable kind="mairie" rows={cityHalls} />
    </div>
  )
}
