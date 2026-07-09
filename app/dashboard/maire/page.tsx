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
import {
  ArrowRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BarChart2Icon,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "approvals" | "transfers" | "approved" | "declined" | "all" | "stats" | null

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-4 border-b">
      <Icon className="size-5 text-muted-foreground" />
      <span className="font-medium text-muted-foreground">{title}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CheckCircleIcon className="mb-2 size-7 text-green-400/60" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MaireDashboard({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; filter?: string; view?: string }>
}) {
  const { section, filter, view } = await searchParams
  const session = await getSession()
  if (!session || session.role !== "MAIRE") redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  // Déterminer la vue active
  const activeSection: Section =
    view === "stats" ? "stats" :
    filter === "approved" ? "approved" :
    filter === "declined" ? "declined" :
    filter === "all" ? "all" :
    section === "approvals" ? "approvals" :
    section === "transfers" ? "transfers" :
    null // vue par défaut = tableau de bord complet

  const [pending, allHistory, transferRequests, allMaireBirths] = await Promise.all([
    prisma.birthRecord.findMany({
      where: { cityHallId, status: "PENDING_APPROVAL" },
      orderBy: { updatedAt: "asc" },
      include: {
        hospital: { select: { name: true, city: true } },
        secretaire: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.birthRecord.findMany({
      where: {
        cityHallId,
        status: {
          in: activeSection === "declined" ? ["DECLINED"]
            : activeSection === "approved" ? ["APPROVED"]
            : ["APPROVED", "DECLINED"],
        },
      },
      orderBy: { updatedAt: "desc" },
      include: { hospital: { select: { name: true } } },
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

  const approvedCount = allMaireBirths.filter((b) => b.status === "APPROVED").length
  const declinedCount = allMaireBirths.filter((b) => b.status === "DECLINED").length

  const statsCards: StatCard[] = [
    {
      title: "En attente",
      value: String(pending.length),
      subtitle: "Actes en attente de signature",
      icon: "clock",
      subtitleIcon: "inbox",
    },
    {
      title: "Actes signés",
      value: String(approvedCount),
      subtitle: "Certificats approuvés",
      icon: "check",
      subtitleIcon: "file",
    },
    {
      title: "Refusés",
      value: String(declinedCount),
      subtitle: "Renvoyés pour correction",
      icon: "x",
      subtitleIcon: "filetext",
    },
    {
      title: "Transferts",
      value: String(transferRequests.length),
      subtitle: "Demandes en attente",
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
      ? `Il y a ${transferRequests.length} demande${transferRequests.length > 1 ? "s" : ""} de transfert en attente.`
      : null

  // ─── Rendu conditionnel selon la vue ─────────────────────────────────────────

  // Vue : Statistiques
  if (activeSection === "stats") {
    return (
      <DashboardContent statsCards={statsCards} chart={
        <DashboardChart
          title="Statistiques d'approbation du Maire"
          series1Label="Dossiers reçus"
          series2Label="Actes approuvés"
          data={chartData}
        />
      } />
    )
  }

  // Vue : À approuver
  if (activeSection === "approvals") {
    return (
      <DashboardContent alertMessage={alertMessage}>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={ClockIcon} title={`Actes en attente de signature (${pending.length})`} />
          <div className="overflow-x-auto">
            {pending.length === 0 ? (
              <EmptyState message="Aucun dossier en attente de signature." />
            ) : (
              <PendingTable births={pending} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  // Vue : Transferts
  if (activeSection === "transfers") {
    return (
      <DashboardContent alertMessage={alertMessage}>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={ArrowRightLeftIcon} title={`Demandes de transfert (${transferRequests.length})`} />
          <div className="overflow-x-auto">
            {transferRequests.length === 0 ? (
              <EmptyState message="Aucune demande de transfert en attente." />
            ) : (
              <TransferTable requests={transferRequests} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  // Vue : Actes approuvés uniquement
  if (activeSection === "approved") {
    const approved = allHistory.filter((b) => b.status === "APPROVED")
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={CheckCircleIcon} title={`Actes signés (${approved.length})`} />
          <div className="overflow-x-auto">
            {approved.length === 0 ? (
              <EmptyState message="Aucun acte signé pour l'instant." />
            ) : (
              <HistoryTable births={approved} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  // Vue : Actes refusés uniquement
  if (activeSection === "declined") {
    const declined = allHistory.filter((b) => b.status === "DECLINED")
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={XCircleIcon} title={`Actes refusés (${declined.length})`} />
          <div className="overflow-x-auto">
            {declined.length === 0 ? (
              <EmptyState message="Aucun acte refusé." />
            ) : (
              <HistoryTable births={declined} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  // Vue : Tout l'historique
  if (activeSection === "all") {
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={BarChart2Icon} title={`Tout l'historique (${allHistory.length})`} />
          <div className="overflow-x-auto">
            {allHistory.length === 0 ? (
              <EmptyState message="Aucun dossier traité pour l'instant." />
            ) : (
              <HistoryTable births={allHistory} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  // Vue par défaut : tableau de bord complet
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
          <SectionTitle icon={ClockIcon} title="En attente de signature" />
          <div className="overflow-x-auto">
            {pending.length === 0 ? (
              <EmptyState message="Aucun dossier en attente." />
            ) : (
              <PendingTable births={pending} />
            )}
          </div>
        </div>

        {/* Transfer requests */}
        {transferRequests.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <SectionTitle icon={ArrowRightLeftIcon} title="Demandes de transfert citoyennes" />
            <div className="overflow-x-auto">
              <TransferTable requests={transferRequests} />
            </div>
          </div>
        )}

        {/* Recent decisions */}
        {allHistory.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <SectionTitle icon={CheckCircleIcon} title="Décisions récentes" />
            <div className="overflow-x-auto">
              <HistoryTable births={allHistory.slice(0, 20)} />
            </div>
          </div>
        )}
      </div>
    </DashboardContent>
  )
}

// ─── Sub-tables (server components) ──────────────────────────────────────────

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{children}</th>
}
function Td({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-4 py-3 text-xs text-muted-foreground ${mono ? "font-mono" : ""}`}>{children}</td>
}

function PendingTable({ births }: { births: any[] }) {
  function formatDate(date: Date | null) {
    if (!date) return "—"
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Hôpital</Th><Th>Secrétaire</Th><Th>Date naissance</Th><Th>Soumis le</Th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">{`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}</td>
            <Td>{b.hospital.name}</Td>
            <Td>{b.secretaire ? `${b.secretaire.firstName} ${b.secretaire.lastName}` : "—"}</Td>
            <Td>{formatDate(b.birthDate)}</Td>
            <Td>{formatDate(b.updatedAt)}</Td>
            <td className="px-4 py-3 text-right">
              <Link href={`/dashboard/maire/births/${b.id}`} className="text-xs font-semibold text-primary hover:underline">
                Examiner
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TransferTable({ requests }: { requests: any[] }) {
  function formatDate(date: Date | null) {
    if (!date) return "—"
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Acte</Th><Th>Demandeur</Th><Th>Mairie cible</Th><Th>Reçu le</Th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3">
              <p className="font-medium text-sm">{`${req.birthRecord.babyFirstName ?? ""} ${req.birthRecord.babyLastName ?? ""}`.trim() || "—"}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{req.birthRecord.certificateNumber ?? req.birthRecord.citizenAccessId ?? "—"}</p>
            </td>
            <td className="px-4 py-3 text-xs">
              <p className="font-medium">{req.requesterName}</p>
              <p className="text-muted-foreground">{req.requesterPhone || "—"}</p>
            </td>
            <Td>{req.targetCityHall.name} · {req.targetCityHall.city}</Td>
            <Td>{formatDate(req.createdAt)}</Td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <form action={approveTransferRequest.bind(null, req.id)}>
                  <button type="submit" className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
                    Accepter
                  </button>
                </form>
                <form action={declineTransferRequest.bind(null, req.id)}>
                  <button type="submit" className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer">
                    Refuser
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HistoryTable({ births }: { births: any[] }) {
  function formatDate(date: Date | null) {
    if (!date) return "—"
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Hôpital</Th><Th>Statut</Th><Th>N° Certificat</Th><Th>ID citoyen</Th><Th>Date</Th><th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">{`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}</td>
            <Td>{b.hospital.name}</Td>
            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
            <Td mono>{b.certificateNumber ?? "—"}</Td>
            <Td mono>{b.citizenAccessId ?? "—"}</Td>
            <Td>{formatDate(b.approvedAt ?? b.declinedAt)}</Td>
            <td className="px-4 py-3 text-right">
              {b.status === "APPROVED" && (
                <Link href={`/dashboard/city-hall/births/${b.id}/view`} className="text-xs font-semibold text-primary hover:underline">
                  Consulter
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
