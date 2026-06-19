import { redirect } from "next/navigation"
import Link from "next/link"
import { PlusIcon, Baby } from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Button } from "@/components/ui/button"
import { DashboardContent } from "@/app/dashboard/_components/content"
import type { StatCard } from "@/app/dashboard/_components/content"

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

  return (
    <DashboardContent
      alertMessage={alertMessage}
      statsCards={statsCards}
      table={<BirthsTable births={births} />}
    />
  )
}


function BirthsTable({
  births,
}: {
  births: Awaited<ReturnType<typeof prisma.birthRecord.findMany>>
}) {
  if (births.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Baby className="size-10 text-muted-foreground/30 mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Aucune déclaration pour l'instant.</p>
        <p className="text-xs text-muted-foreground/70 mt-1 mb-5">
          Commencez par déclarer une naissance.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/hospital/births/new">
            <PlusIcon className="size-3.5 mr-1.5" />
            Nouvelle naissance
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enfant</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date naissance</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Mairie</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Modifié le</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {births.map((b) => (
          <tr
            key={b.id}
            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
          >
            <td className="px-4 py-3 font-medium">
              {b.babyFirstName || b.babyLastName
                ? `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim()
                : <span className="text-muted-foreground italic text-xs">Sans nom</span>}
            </td>
            <td className="px-4 py-3 text-muted-foreground text-xs">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(b.birthDate ?? Date.now()))}
            </td>
            <td className="px-4 py-3 text-muted-foreground text-xs">
              {(b as { cityHall?: { name: string } }).cityHall?.name ?? "—"}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-4 py-3 text-muted-foreground text-xs">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(b.updatedAt))}
            </td>
            <td className="px-4 py-3 text-right">
              {b.status === "DRAFT" && (
                <Link
                  href={`/dashboard/hospital/births/${b.id}/edit`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Modifier
                </Link>
              )}
              {b.status === "APPROVED" && b.certificateNumber && (
                <a
                  href={`/api/certificate/${b.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Certificat ↗
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
