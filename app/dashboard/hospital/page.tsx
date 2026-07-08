import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/app/dashboard/_components/content"
import type { StatCard } from "@/app/dashboard/_components/content"
import { getMonthlyStats } from "@/lib/stats"
import { DashboardChart } from "@/app/dashboard/_components/dashboard-chart"
import { BirthsTable } from "./_components/births-table"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default async function HospitalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  // Toutes les déclarations du médecin (pour stats & graph)
  const allBirths = await prisma.birthRecord.findMany({
    where: { doctorId: session.userId },
    orderBy: { updatedAt: "desc" },
    include: { cityHall: { select: { name: true } } },
  })

  // Table : uniquement DRAFT et DECLINED
  const actionableBirths = allBirths.filter((b) =>
    ["DRAFT", "DECLINED"].includes(b.status)
  )

  const stats = {
    draft: allBirths.filter((b) => b.status === "DRAFT").length,
    submitted: allBirths.filter((b) =>
      ["SUBMITTED", "PROCESSING", "PENDING_APPROVAL"].includes(b.status)
    ).length,
    approved: allBirths.filter((b) => b.status === "APPROVED").length,
    declined: allBirths.filter((b) => b.status === "DECLINED").length,
  }

  const statsCards: StatCard[] = [
    {
      title: "Brouillons",
      value: String(stats.draft),
      subtitle: "À finaliser et soumettre",
      icon: "filetext",
      subtitleIcon: "clock",
    },
    {
      title: "En traitement mairie",
      value: String(stats.submitted),
      subtitle: "En cours d'instruction",
      icon: "send",
      subtitleIcon: "inbox",
    },
    {
      title: "Actes signés",
      value: String(stats.approved),
      subtitle: "Certificats validés",
      icon: "check",
      subtitleIcon: "file",
    },
    {
      title: "À corriger",
      value: String(stats.declined),
      subtitle: "Renvoyés par la mairie",
      icon: "x",
      subtitleIcon: "alert",
    },
  ]

  const alertMessage =
    stats.declined > 0
      ? `${stats.declined} déclaration(s) rejetée(s) par la mairie — corrections requises.`
      : stats.draft > 0
      ? `${stats.draft} brouillon(s) en cours — pensez à les finaliser.`
      : null

  const chartData = getMonthlyStats(
    allBirths,
    () => true,
    (b) => b.status !== "DRAFT"
  )

  return (
    <DashboardContent
      alertMessage={alertMessage}
      statsCards={statsCards}
      chart={
        <DashboardChart
          title="Mes déclarations de naissance"
          series1Label="Déclarations créées"
          series2Label="Soumises à la mairie"
          data={chartData}
        />
      }
      table={
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="font-medium text-muted-foreground text-sm">
              Brouillons & Corrections à traiter
            </span>
            <Button asChild size="sm" className="gap-2 h-8 text-xs cursor-pointer">
              <Link href="/dashboard/hospital/births/new">
                <PlusIcon className="size-3.5" />
                Déclarer
              </Link>
            </Button>
          </div>
          <BirthsTable births={actionableBirths as any} initialStatusFilter={filter} />
        </div>
      }
    />
  )
}
