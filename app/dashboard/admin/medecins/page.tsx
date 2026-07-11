import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DoctorTable } from "@/app/dashboard/admin/_components/doctor-table"

export default async function AdminMedecinsPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/dashboard")

  const [doctors, hospitals] = await Promise.all([
    prisma.user.findMany({
      where: { role: "DOCTOR" },
      include: { hospitalAssignments: { include: { hospital: { select: { name: true } } } } },
      orderBy: { lastName: "asc" },
    }),
    prisma.hospital.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Médecins</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Gérez les comptes des médecins déclarants et leur rattachement aux hôpitaux.
        </p>
      </div>
      <DoctorTable rows={doctors} hospitals={hospitals} />
    </div>
  )
}
