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
import { FileTextIcon, InboxIcon, ClockIcon, CheckCircleIcon, ArrowRightLeftIcon } from "lucide-react"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(date)
  )
}

export default async function CityHallDashboard() {
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role))
    redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const [submitted, mine, transferredCopies, allCityHallBirths] = await Promise.all([
    // Unclaimed submitted births for this city hall
    prisma.birthRecord.findMany({
      where: { cityHallId, status: "SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: { hospital: { select: { name: true, city: true } } },
    }),
    // Births this secretaire is processing
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
      take: 20,
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
      select: { createdAt: true, status: true },
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
      ? `Il y a ${submitted.length} déclaration${submitted.length > 1 ? "s" : ""} en attente de réclamation par le secrétariat.`
      : mine.length > 0
      ? `Vous traitez actuellement ${mine.length} déclaration${mine.length > 1 ? "s" : ""}.`
      : null

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
        {/* Submitted (unclaimed) */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <InboxIcon className="size-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">
              Dossiers soumis par les hôpitaux (en attente)
            </span>
          </div>
          <div className="overflow-x-auto">
            {submitted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <InboxIcon className="mb-2 size-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucun dossier en attente.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hôpital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date naissance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Soumis le</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {submitted.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        {b.babyFirstName || b.babyLastName ? (
                          `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim()
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Sans nom</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{b.hospital.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.birthDate)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <ClaimButton birthId={b.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Transferred copies */}
        {transferredCopies.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <ArrowRightLeftIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Copies transférées disponibles au retrait
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Mairie d’origine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">N° acte</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Disponible depuis</th>
                  </tr>
                </thead>
                <tbody>
                  {transferredCopies.map((copy) => (
                    <tr
                      key={copy.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        {`${copy.birthRecord.babyFirstName ?? ""} ${copy.birthRecord.babyLastName ?? ""}`.trim() || "—"}
                        <span className="block font-normal text-muted-foreground text-[10px] mt-0.5">
                          Né(e) le {formatDate(copy.birthRecord.birthDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {copy.birthRecord.cityHall
                          ? `${copy.birthRecord.cityHall.name} · ${copy.birthRecord.cityHall.city}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                        {copy.birthRecord.certificateNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(copy.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* My processing */}
        {mine.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b">
              <FileTextIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Mes dossiers en cours de traitement
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hôpital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {mine.map((b) => (
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
                      <td className="px-4 py-3 text-right">
                        {b.status === "PROCESSING" && (
                          <Link
                            href={`/dashboard/city-hall/births/${b.id}`}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Compléter
                          </Link>
                        )}
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
