import { redirect } from "next/navigation"
import Link from "next/link"
import { FileTextIcon, InboxIcon, ClockIcon, CheckCircleIcon } from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimButton } from "./_components/claim-button"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

export default async function CityHallDashboard() {
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role)) redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const [submitted, mine] = await Promise.all([
    // Unclaimed submitted births for this city hall
    prisma.birthRecord.findMany({
      where: { cityHallId, status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
    // Births this secretaire is processing
    prisma.birthRecord.findMany({
      where: { secretaireId: session.userId, status: { in: ["PROCESSING", "PENDING_APPROVAL"] } },
      orderBy: { updatedAt: "desc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
  ])

  const approved = await prisma.birthRecord.count({
    where: { cityHallId, status: "APPROVED" },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Tableau de bord — Secrétariat</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{session.username}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <InboxIcon className="size-3.5" /> En attente
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{submitted.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ClockIcon className="size-3.5" /> En traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{mine.length}</p>
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
      </div>

      {/* Submitted (unclaimed) */}
      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">
            Dossiers soumis par les hôpitaux
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submitted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <InboxIcon className="size-7 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun dossier en attente.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date naissance</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Soumis le</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {submitted.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {b.babyFirstName || b.babyLastName
                        ? `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim()
                        : <span className="text-muted-foreground italic">Sans nom</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.hospital.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.birthDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <ClaimButton birthId={b.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* My processing */}
      {mine.length > 0 && (
        <Card>
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-sm font-medium">Mes dossiers en cours</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {mine.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.hospital.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {b.status === "PROCESSING" && (
                        <Link href={`/dashboard/city-hall/births/${b.id}`} className="text-primary hover:underline">
                          Compléter
                        </Link>
                      )}
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
