import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ClaimButton } from "./_components/claim-button"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { DashboardContent } from "@/app/dashboard/_components/content"
import type { StatCard } from "@/app/dashboard/_components/content"
import { getMonthlyStats } from "@/lib/stats"
import { DashboardChart } from "@/app/dashboard/_components/dashboard-chart"
import { FileTextIcon, InboxIcon, ClockIcon, CheckCircleIcon, ArrowRightLeftIcon, BookOpenIcon } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterKey = "submitted" | "processing" | "pending_approval" | "all" | "copies" | null

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
      <InboxIcon className="mb-2 size-7 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{children}</th>
}
function Td({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-4 py-3 text-xs text-muted-foreground ${mono ? "font-mono" : ""}`}>{children}</td>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CityHallDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role))
    redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const activeFilter: FilterKey =
    filter === "submitted" ? "submitted" :
    filter === "processing" ? "processing" :
    filter === "pending_approval" ? "pending_approval" :
    filter === "all" ? "all" :
    filter === "copies" ? "copies" :
    null

  const [submitted, mine, transferredCopies, allCityHallBirths] = await Promise.all([
    prisma.birthRecord.findMany({
      where: { cityHallId, status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
    prisma.birthRecord.findMany({
      where: {
        secretaireId: session.userId,
        status: { in: ["PROCESSING", "PENDING_APPROVAL"] },
      },
      orderBy: { updatedAt: "desc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
    prisma.birthRecordCopy.findMany({
      where: { cityHallId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        birthRecord: {
          select: {
            babyFirstName: true,
            babyLastName: true,
            birthDate: true,
            certificateNumber: true,
            cityHall: { select: { name: true, city: true } },
          },
        },
      },
    }),
    prisma.birthRecord.findMany({
      where: { cityHallId },
      orderBy: { updatedAt: "desc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
  ])

  const approved = allCityHallBirths.filter((b) => b.status === "APPROVED").length

  const statsCards: StatCard[] = [
    {
      title: "En attente",
      value: String(submitted.length),
      subtitle: "Dossiers à réclamer",
      icon: "inbox",
      subtitleIcon: "clock",
    },
    {
      title: "En traitement",
      value: String(mine.length),
      subtitle: "Mes dossiers en cours",
      icon: "clock",
      subtitleIcon: "filetext",
    },
    {
      title: "Approuvés",
      value: String(approved),
      subtitle: "Actes signés par le Maire",
      icon: "check",
      subtitleIcon: "file",
    },
    {
      title: "Copies physiques",
      value: String(transferredCopies.length),
      subtitle: "Prêtes au retrait",
      icon: "file",
      subtitleIcon: "transfer",
    },
  ]

  const chartData = getMonthlyStats(
    allCityHallBirths,
    (b) => b.status !== "DRAFT",
    (b) => b.status === "APPROVED"
  )

  const alertMessage =
    submitted.length > 0
      ? `${submitted.length} déclaration${submitted.length > 1 ? "s" : ""} en attente de réclamation par le secrétariat.`
      : mine.length > 0
      ? `Vous traitez actuellement ${mine.length} déclaration${mine.length > 1 ? "s" : ""}.`
      : null

  // ─── Vues filtrées ──────────────────────────────────────────────────────────

  if (activeFilter === "submitted") {
    return (
      <DashboardContent alertMessage={alertMessage}>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={InboxIcon} title={`Dossiers reçus — en attente de réclamation (${submitted.length})`} />
          <div className="overflow-x-auto">
            {submitted.length === 0 ? (
              <EmptyState message="Aucun dossier en attente de réclamation." />
            ) : (
              <SubmittedTable births={submitted} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  if (activeFilter === "processing") {
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={ClockIcon} title={`Mes dossiers en traitement (${mine.length})`} />
          <div className="overflow-x-auto">
            {mine.length === 0 ? (
              <EmptyState message="Vous n'avez aucun dossier en cours de traitement." />
            ) : (
              <MineTable births={mine} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  if (activeFilter === "pending_approval") {
    const pendingApproval = mine.filter((b) => b.status === "PENDING_APPROVAL")
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={CheckCircleIcon} title={`Soumis au Maire — en attente de signature (${pendingApproval.length})`} />
          <div className="overflow-x-auto">
            {pendingApproval.length === 0 ? (
              <EmptyState message="Aucun dossier actuellement soumis au Maire." />
            ) : (
              <MineTable births={pendingApproval} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  if (activeFilter === "copies") {
    return (
      <DashboardContent>
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={ArrowRightLeftIcon} title={`Copies d'actes transférées reçues (${transferredCopies.length})`} />
          <div className="overflow-x-auto">
            {transferredCopies.length === 0 ? (
              <EmptyState message="Aucune copie d'acte reçue." />
            ) : (
              <CopiesTable copies={transferredCopies} />
            )}
          </div>
        </div>
      </DashboardContent>
    )
  }

  if (activeFilter === "all") {
    return (
      <DashboardContent statsCards={statsCards}>
        <div className="space-y-6">
          <div className="rounded-xl border bg-card overflow-hidden">
            <SectionTitle icon={BookOpenIcon} title={`Tous les dossiers de la mairie — ${allCityHallBirths.length} au total`} />
            <div className="overflow-x-auto">
              {allCityHallBirths.length === 0 ? (
                <EmptyState message="Aucun dossier pour cette mairie." />
              ) : (
                <AllBirthsTable births={allCityHallBirths} currentUserId={session.userId} />
              )}
            </div>
          </div>
          {transferredCopies.length > 0 && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <SectionTitle icon={ArrowRightLeftIcon} title={`Copies transférées disponibles (${transferredCopies.length})`} />
              <div className="overflow-x-auto">
                <CopiesTable copies={transferredCopies} />
              </div>
            </div>
          )}
        </div>
      </DashboardContent>
    )
  }

  // ─── Vue par défaut ──────────────────────────────────────────────────────────

  return (
    <DashboardContent
      alertMessage={alertMessage}
      statsCards={statsCards}
      chart={
        <DashboardChart
          title="Activité du secrétariat"
          series1Label="Dossiers reçus"
          series2Label="Actes signés"
          data={chartData}
        />
      }
    >
      <div className="space-y-6">
        {/* Dossiers en attente */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <SectionTitle icon={InboxIcon} title="Dossiers soumis par les hôpitaux (en attente)" />
          <div className="overflow-x-auto">
            {submitted.length === 0 ? (
              <EmptyState message="Aucun dossier en attente." />
            ) : (
              <SubmittedTable births={submitted} />
            )}
          </div>
        </div>

        {/* Copies transférées */}
        {transferredCopies.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <SectionTitle icon={ArrowRightLeftIcon} title="Copies transférées disponibles au retrait" />
            <div className="overflow-x-auto">
              <CopiesTable copies={transferredCopies} />
            </div>
          </div>
        )}

        {/* Mes dossiers en cours */}
        {mine.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <SectionTitle icon={FileTextIcon} title="Mes dossiers en cours de traitement" />
            <div className="overflow-x-auto">
              <MineTable births={mine} />
            </div>
          </div>
        )}
      </div>
    </DashboardContent>
  )
}

// ─── Sub-tables ────────────────────────────────────────────────────────────────

function SubmittedTable({ births }: { births: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Hôpital</Th><Th>Date naissance</Th><Th>Soumis le</Th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">
              {b.babyFirstName || b.babyLastName
                ? `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim()
                : <span className="text-muted-foreground italic text-xs">Sans nom</span>}
            </td>
            <Td>{b.hospital.name}</Td>
            <Td>{formatDate(b.birthDate)}</Td>
            <Td>{formatDate(b.updatedAt)}</Td>
            <td className="px-4 py-3 text-right"><ClaimButton birthId={b.id} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function MineTable({ births }: { births: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Hôpital</Th><Th>Statut</Th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">{`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}</td>
            <Td>{b.hospital.name}</Td>
            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
            <td className="px-4 py-3 text-right">
              {b.status === "PROCESSING" && (
                <Link href={`/dashboard/city-hall/births/${b.id}`} className="text-xs font-semibold text-primary hover:underline">
                  Compléter
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AllBirthsTable({ births, currentUserId }: { births: any[]; currentUserId: string }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Hôpital</Th><Th>Statut</Th><Th>Mis à jour</Th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">{`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || "—"}</td>
            <Td>{b.hospital.name}</Td>
            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
            <Td>{formatDate(b.updatedAt)}</Td>
            <td className="px-4 py-3 text-right">
              {b.status === "SUBMITTED" && <ClaimButton birthId={b.id} />}
              {b.status === "PROCESSING" && b.secretaireId === currentUserId && (
                <Link href={`/dashboard/city-hall/births/${b.id}`} className="text-xs font-semibold text-primary hover:underline">
                  Compléter
                </Link>
              )}
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

function CopiesTable({ copies }: { copies: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <Th>Enfant</Th><Th>Mairie d'origine</Th><Th>N° acte</Th><Th>Disponible depuis</Th><th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {copies.map((copy) => (
          <tr key={copy.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-medium text-sm">
              {`${copy.birthRecord.babyFirstName ?? ""} ${copy.birthRecord.babyLastName ?? ""}`.trim() || "—"}
              <span className="block font-normal text-muted-foreground text-[10px] mt-0.5">
                Né(e) le {formatDate(copy.birthRecord.birthDate)}
              </span>
            </td>
            <Td>{copy.birthRecord.cityHall ? `${copy.birthRecord.cityHall.name} · ${copy.birthRecord.cityHall.city}` : "—"}</Td>
            <Td mono>{copy.birthRecord.certificateNumber ?? "—"}</Td>
            <Td>{formatDate(copy.createdAt)}</Td>
            <td className="px-4 py-3 text-right">
              <Link href={`/dashboard/city-hall/births/${copy.birthRecordId}/view`} className="text-xs font-semibold text-primary hover:underline">
                Consulter
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
