import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

export default async function MaireDashboard() {
  const session = await getSession()
  if (!session || session.role !== "MAIRE") redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const [pending, recent] = await Promise.all([
    prisma.birthRecord.findMany({
      where: { cityHallId, status: "PENDING_APPROVAL" },
      orderBy: { updatedAt: "asc" },
      include: {
        hospital: { select: { name: true, city: true } },
        secretaire: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.birthRecord.findMany({
      where: { cityHallId, status: { in: ["APPROVED", "DECLINED"] } },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        hospital: { select: { name: true } },
      },
    }),
  ])

  const approved = recent.filter((b) => b.status === "APPROVED").length
  const declined = recent.filter((b) => b.status === "DECLINED").length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Approbations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{session.username}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ClockIcon className="size-3.5" /> En attente
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CheckCircleIcon className="size-3.5 text-green-500" /> Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <XCircleIcon className="size-3.5 text-red-500" /> Refusés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-red-600">{declined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending approvals */}
      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">Dossiers en attente de signature</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircleIcon className="size-7 text-green-400/60 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun dossier en attente.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Secrétaire</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date naissance</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Soumis le</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {pending.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.hospital.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.secretaire ? `${b.secretaire.firstName} ${b.secretaire.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.birthDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/maire/births/${b.id}`}
                        className="text-primary hover:underline"
                      >
                        Examiner
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Recent decisions */}
      {recent.length > 0 && (
        <Card>
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-sm font-medium">Décisions récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">N° Certificat</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.hospital.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {b.certificateNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(b.approvedAt ?? b.declinedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
