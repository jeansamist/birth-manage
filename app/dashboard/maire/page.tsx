import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { approveTransferRequest, declineTransferRequest } from "@/app/actions/birth"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { DashboardContent } from "@/app/dashboard/_components/content"
import type { StatCard } from "@/app/dashboard/_components/content"
import { getMonthlyStats } from "@/lib/stats"
import { DashboardChart } from "@/app/dashboard/_components/dashboard-chart"
import { ArrowRightLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InboxIcon } from "lucide-react"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(date)
  )
}

export default async function MaireDashboard() {
  const session = await getSession()
  if (!session || session.role !== "MAIRE") redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const [pending, recent, transferRequests, allMaireBirths] = await Promise.all([
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
    prisma.transferRequest.findMany({
      where: { sourceCityHallId: cityHallId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        targetCityHall: { select: { name: true, city: true } },
        birthRecord: {
          select: {
            babyFirstName: true,
            babyLastName: true,
            certificateNumber: true,
            citizenAccessId: true,
          },
        },
      },
    }),
    prisma.birthRecord.findMany({
      where: { cityHallId },
      select: { createdAt: true, status: true },
    }),
  ])

  const approved = allMaireBirths.filter((b) => b.status === "APPROVED").length
  const declined = allMaireBirths.filter((b) => b.status === "DECLINED").length

  const statsCards: StatCard[] = [
    {
      title: "En attente",
      value: String(pending.length),
      subtitle: "Actes en attente de signature",
      icon: "clock",
      subtitleIcon: "inbox",
    },
    {
      title: "Approuvés",
      value: String(approved),
      subtitle: "Certificats signés par vous",
      icon: "check",
      subtitleIcon: "file",
    },
    {
      title: "Refusés",
      value: String(declined),
      subtitle: "Actes renvoyés pour correction",
      icon: "x",
      subtitleIcon: "filetext",
    },
    {
      title: "Transferts",
      value: String(transferRequests.length),
      subtitle: "Demandes de transfert",
      icon: "transfer",
      subtitleIcon: "clock",
    },
  ]

  const chartData = getMonthlyStats(
    allMaireBirths,
    (b) => b.status !== "DRAFT",
    (b) => b.status === "APPROVED"
  )

  const alertMessage =
    pending.length > 0
      ? `Vous avez ${pending.length} acte${pending.length > 1 ? "s" : ""} en attente de signature numérique.`
      : transferRequests.length > 0
      ? `Il y a ${transferRequests.length} demande${transferRequests.length > 1 ? "s" : ""} de transfert de dossiers en attente.`
      : null

  return (
    <DashboardContent
      alertMessage={alertMessage}
      statsCards={statsCards}
      chart={
        <DashboardChart
          title="Statistiques d'approbation du Maire"
          series1Label="Dossiers reçus"
          series2Label="Actes approuvés"
          data={chartData}
        />
      }
    >
      <div className="space-y-6">
        {/* Pending approvals */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <ClockIcon className="size-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">
              Dossiers en attente de signature
            </span>
          </div>
          <div className="overflow-x-auto">
            {pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircleIcon className="mb-2 size-7 text-green-400/60" />
                <p className="text-sm text-muted-foreground">Aucun dossier en attente.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hôpital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Secrétaire</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date naissance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Soumis le</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pending.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{b.hospital.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {b.secretaire ? `${b.secretaire.firstName} ${b.secretaire.lastName}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.birthDate)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/maire/births/${b.id}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Examiner
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Transfer requests */}
        {transferRequests.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <ArrowRightLeftIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Demandes de transfert citoyennes
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acte</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Demandeur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Mairie cible</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reçu le</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {transferRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">
                          {`${request.birthRecord.babyFirstName ?? ""} ${request.birthRecord.babyLastName ?? ""}`.trim() || "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {request.birthRecord.certificateNumber ?? request.birthRecord.citizenAccessId ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium">{request.requesterName}</p>
                        <p className="text-muted-foreground mt-0.5">{request.requesterPhone || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {request.targetCityHall.name} · {request.targetCityHall.city}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(request.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <form action={approveTransferRequest.bind(null, request.id)}>
                            <button
                              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
                              type="submit"
                            >
                              Accepter
                            </button>
                          </form>
                          <form action={declineTransferRequest.bind(null, request.id)}>
                            <button
                              className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                              type="submit"
                            >
                              Refuser
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent decisions */}
        {recent.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <CheckCircleIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Décisions récentes
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hôpital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">N° Certificat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID citoyen</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{b.hospital.name}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                        {b.certificateNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                        {b.citizenAccessId ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatDate(b.approvedAt ?? b.declinedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardContent>
  )
}

