import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InstitutionTable } from "@/app/dashboard/admin/_components/institution-table"

export default async function AdminHopitauxPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  const hospitals = await prisma.hospital.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">Hôpitaux</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Gérez les établissements hospitaliers rattachés au système d'état civil.
        </p>
      </div>
      <InstitutionTable kind="hopital" rows={hospitals} />
    </div>
  )
}
