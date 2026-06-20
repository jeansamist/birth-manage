import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/app/dashboard/_components/content"
import type { StatCard } from "@/app/dashboard/_components/content"
import { getMonthlyStats } from "@/lib/stats"
import { DashboardChart } from "@/app/dashboard/_components/dashboard-chart"
import { BirthsTable } from "./_components/births-table"

export default async function HospitalDashboard() {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  const births = await prisma.birthRecord.findMany({
    where: { doctorId: session.userId },
    orderBy: { updatedAt: "desc" },
    include: { cityHall: { select: { name: true } } },
  })

  const stats = {
    total: births.length,
    draft: births.filter((b) => b.status === "DRAFT").length,
    inProgress: births.filter((b) =>
      ["SUBMITTED", "PROCESSING", "PENDING_APPROVAL"].includes(b.status)
    ).length,
    approved: births.filter((b) => b.status === "APPROVED").length,
    declined: births.filter((b) => b.status === "DECLINED").length,
  }

  const statsCards: StatCard[] = [
    {
      title: "Total déclarations",
      value: String(stats.total),
      subtitle: `Brouillons : ${stats.draft}`,
      icon: "baby",
      subtitleIcon: "filetext",
    },
    {
      title: "En attente mairie",
      value: String(stats.inProgress),
      subtitle: "En cours de traitement",
      icon: "clock",
      subtitleIcon: "inbox",
    },
    {
      title: "Actes approuvés",
      value: String(stats.approved),
      subtitle: "Certificats signés",
      icon: "check",
      subtitleIcon: "file",
    },
    {
      title: "Refusés",
      value: String(stats.declined),
      subtitle: "À corriger",
      icon: "x",
      subtitleIcon: "filetext",
    },
  ]

  const alertMessage =
    stats.draft > 0
      ? `Vous avez ${stats.draft} déclaration${stats.draft > 1 ? "s" : ""} en brouillon — pensez à les soumettre à la mairie.`
      : stats.inProgress > 0
      ? `${stats.inProgress} déclaration${stats.inProgress > 1 ? "s sont" : " est"} en cours de traitement à la mairie.`
      : null

  const chartData = getMonthlyStats(
    births,
    () => true,
    (b) => b.status !== "DRAFT"
  )

  return (
    <DashboardContent
      alertMessage={alertMessage}
      statsCards={statsCards}
      chart={
        <DashboardChart
          title="Flux des déclarations"
          series1Label="Déclarations créées"
          series2Label="Soumises à la mairie"
          data={chartData}
        />
      }
      table={<BirthsTable births={births as any} />}
    />
  )
}

