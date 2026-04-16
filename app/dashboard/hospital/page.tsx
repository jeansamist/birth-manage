import { redirect } from "next/navigation"
import Link from "next/link"
import { PlusIcon, FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

export default async function HospitalDashboard() {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  const births = await prisma.birthRecord.findMany({
    where: { doctorId: session.userId },
    orderBy: { updatedAt: "desc" },
    include: {
      cityHall: { select: { name: true } },
    },
  })

  const stats = {
    total: births.length,
    draft: births.filter((b) => b.status === "DRAFT").length,
    submitted: births.filter((b) =>
      ["SUBMITTED", "PROCESSING", "PENDING_APPROVAL"].includes(b.status),
    ).length,
    approved: births.filter((b) => b.status === "APPROVED").length,
    declined: births.filter((b) => b.status === "DECLINED").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Tableau de bord</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bienvenue, Dr. {session.username}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/hospital/births/new">
            <PlusIcon className="size-3.5 mr-1.5" />
            Nouvelle naissance
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <FileTextIcon className="size-3.5" /> Total
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ClockIcon className="size-3.5" /> En cours
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{stats.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CheckCircleIcon className="size-3.5 text-green-500" /> Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <XCircleIcon className="size-3.5 text-red-500" /> Refusés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Births table */}
      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">Mes déclarations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {births.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileTextIcon className="size-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Aucune déclaration pour l'instant.</p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link href="/dashboard/hospital/births/new">
                  <PlusIcon className="size-3.5 mr-1.5" /> Nouvelle naissance
                </Link>
              </Button>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Enfant</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date naissance</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mairie</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Modifié le</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {births.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {b.babyFirstName || b.babyLastName
                        ? `${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim()
                        : <span className="text-muted-foreground italic">Sans nom</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.birthDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.cityHall?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {b.status === "DRAFT" && (
                        <Link
                          href={`/dashboard/hospital/births/${b.id}/edit`}
                          className="text-primary hover:underline"
                        >
                          Modifier
                        </Link>
                      )}
                      {b.status === "APPROVED" && b.certificateNumber && (
                        <a
                          href={`/api/certificate/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Certificat
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
