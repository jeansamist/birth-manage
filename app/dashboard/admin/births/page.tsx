import Link from "next/link"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminBirthsPage() {
  const session = await getSession()
  requireAdmin(session)

  const births = await prisma.birthRecord.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      hospital: { select: { name: true } },
      cityHall: { select: { name: true } },
      doctor: { select: { firstName: true, lastName: true } },
    },
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Actes de naissance</h1>
        <p className="text-xs text-muted-foreground">Supervision globale — 50 derniers dossiers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mairie</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N° acte</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {births.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.hospital.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.cityHall?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{b.certificateNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/admin/births/${b.id}`} className="text-primary hover:underline">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
