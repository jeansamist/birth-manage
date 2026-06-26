import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  getCityHallInboxCounts,
  getSubmittedBirths,
} from "@/lib/city-hall-inbox"
import {
  approveTransferRequest,
  declineTransferRequest,
} from "@/app/actions/birth"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import {
  IncomingSubmissionsAlert,
  PendingApprovalAlert,
} from "@/app/dashboard/_components/incoming-submissions-alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const [pending, recent, transferRequests, submittedFromHospitals, inboxCounts] =
    await Promise.all([
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
    getSubmittedBirths(cityHallId),
    getCityHallInboxCounts(cityHallId),
  ])

  const approved = recent.filter((b) => b.status === "APPROVED").length
  const declined = recent.filter((b) => b.status === "DECLINED").length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Approbations</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {session.username}
        </p>
      </div>

      <IncomingSubmissionsAlert
        count={inboxCounts.submitted}
        role="MAIRE"
      />
      <PendingApprovalAlert count={inboxCounts.pendingApproval} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ClockIcon className="size-3.5" /> En attente
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CheckCircleIcon className="size-3.5 text-green-500" /> Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <XCircleIcon className="size-3.5 text-red-500" /> Refusés
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-red-600">{declined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Hospital submissions received */}
      {submittedFromHospitals.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              Dossiers reçus des hôpitaux
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                {submittedFromHospitals.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Enfant
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Hôpital
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Date naissance
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Reçu le
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {submittedFromHospitals.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.hospital.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(b.birthDate)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(b.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Pending approvals */}
      <Card>
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="text-sm font-medium">
            Dossiers en attente de signature
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircleIcon className="mb-2 size-7 text-green-400/60" />
              <p className="text-sm text-muted-foreground">
                Aucun dossier en attente.
              </p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Enfant
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Hôpital
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Secrétaire
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Date naissance
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Soumis le
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {pending.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.hospital.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.secretaire
                        ? `${b.secretaire.firstName} ${b.secretaire.lastName}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(b.birthDate)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(b.updatedAt)}
                    </td>
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

      {/* Transfer requests */}
      <Card>
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ArrowRightLeftIcon className="size-4" /> Demandes de transfert
            citoyennes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transferRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircleIcon className="mb-2 size-7 text-green-400/60" />
              <p className="text-sm text-muted-foreground">
                Aucune demande de transfert en attente.
              </p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Acte
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Demandeur
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Mairie cible
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Reçu le
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {transferRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {`${request.birthRecord.babyFirstName ?? ""} ${request.birthRecord.babyLastName ?? ""}`.trim() ||
                          "—"}
                      </p>
                      <p className="text-muted-foreground">
                        {request.birthRecord.certificateNumber ??
                          request.birthRecord.citizenAccessId ??
                          "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{request.requesterName}</p>
                      <p className="text-muted-foreground">
                        {request.requesterPhone || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {request.targetCityHall.name} ·{" "}
                      {request.targetCityHall.city}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <form
                          action={approveTransferRequest.bind(null, request.id)}
                        >
                          <button
                            className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90"
                            type="submit"
                          >
                            Accepter
                          </button>
                        </form>
                        <form
                          action={declineTransferRequest.bind(null, request.id)}
                        >
                          <button
                            className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:bg-muted"
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
          )}
        </CardContent>
      </Card>

      {/* Recent decisions */}
      {recent.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">
              Décisions récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Enfant
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Hôpital
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    N° Certificat
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    ID citoyen
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {b.hospital.name}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {b.certificateNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {b.citizenAccessId ?? "—"}
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
