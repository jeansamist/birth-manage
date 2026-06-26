import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Card, CardContent } from "@/components/ui/card"

function fmt(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date)
}

export default async function AdminTransfersPage() {
  const session = await getSession()
  requireAdmin(session)

  const transfers = await prisma.transferRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      birthRecord: {
        select: { babyFirstName: true, babyLastName: true, certificateNumber: true },
      },
      sourceCityHall: { select: { name: true } },
      targetCityHall: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Transferts citoyens</h1>
        <p className="text-xs text-muted-foreground">{transfers.length} demande(s) récentes</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Acte</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Demandeur</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Source → Cible</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {`${t.birthRecord.babyFirstName ?? ""} ${t.birthRecord.babyLastName ?? ""}`.trim() || "—"}
                    </p>
                    <p className="text-muted-foreground">{t.birthRecord.certificateNumber ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">{t.requesterName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.sourceCityHall.name} → {t.targetCityHall.name}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{fmt(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
