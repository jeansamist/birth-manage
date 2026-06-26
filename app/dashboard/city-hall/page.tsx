import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FileTextIcon,
  InboxIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCityHallInboxCounts } from "@/lib/city-hall-inbox"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { IncomingSubmissionsAlert } from "@/app/dashboard/_components/incoming-submissions-alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimButton } from "./_components/claim-button"

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

  const [submitted, mine, transferredCopies, approvedBirths, inboxCounts] =
    await Promise.all([
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
            id: true,
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
      where: { cityHallId, status: "APPROVED" },
      orderBy: { approvedAt: "desc" },
      take: 20,
      select: {
        id: true,
        babyFirstName: true,
        babyLastName: true,
        birthDate: true,
        certificateNumber: true,
        approvedAt: true,
      },
    }),
    getCityHallInboxCounts(cityHallId),
  ])

  const approved = await prisma.birthRecord.count({
    where: { cityHallId, status: "APPROVED" },
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Tableau de bord — Secrétariat</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {session.username}
        </p>
      </div>

      <IncomingSubmissionsAlert
        count={inboxCounts.submitted}
        role={session.role}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <InboxIcon className="size-3.5" /> En attente
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{submitted.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ClockIcon className="size-3.5" /> En traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{mine.length}</p>
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
      </div>

      {/* Submitted (unclaimed) */}
      <Card id="dossiers-hopitaux">
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            Dossiers soumis par les hôpitaux
            {submitted.length > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                {submitted.length} nouveau{submitted.length > 1 ? "x" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submitted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <InboxIcon className="mb-2 size-7 text-muted-foreground/40" />
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
                    Date naissance
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Soumis le
                  </th>
                  <th className="px-4 py-2.5" />
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
                        <span className="text-muted-foreground italic">
                          Sans nom
                        </span>
                      )}
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
                    <td className="px-4 py-3 text-right">
                      {session.role === "SECRETAIRE" ? (
                        <ClaimButton birthId={b.id} />
                      ) : (
                        <span className="text-muted-foreground">
                          En attente secrétariat
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Approved acts */}
      {approvedBirths.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileTextIcon className="size-4" /> Actes de naissance approuvés
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
                    N° acte
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Approuvé le
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {approvedBirths.map((birth) => (
                  <tr
                    key={birth.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {`${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim() ||
                        "—"}
                      <span className="block font-normal text-muted-foreground">
                        Né(e) le {formatDate(birth.birthDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {birth.certificateNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(birth.approvedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {session.role === "SECRETAIRE" && birth.certificateNumber ? (
                        <a
                          href={`/api/certificate/${birth.id}`}
                          className="text-primary hover:underline"
                        >
                          Télécharger PDF
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Transferred copies */}
      {transferredCopies.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileTextIcon className="size-4" /> Copies transférées disponibles
              au retrait
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
                    Mairie d’origine
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    N° acte
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Disponible depuis
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {transferredCopies.map((copy) => (
                  <tr
                    key={copy.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {`${copy.birthRecord.babyFirstName ?? ""} ${copy.birthRecord.babyLastName ?? ""}`.trim() ||
                        "—"}
                      <span className="block font-normal text-muted-foreground">
                        Né(e) le {formatDate(copy.birthRecord.birthDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {copy.birthRecord.cityHall
                        ? `${copy.birthRecord.cityHall.name} · ${copy.birthRecord.cityHall.city}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {copy.birthRecord.certificateNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(copy.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {session.role === "SECRETAIRE" && copy.birthRecord.certificateNumber ? (
                        <a
                          href={`/api/certificate/${copy.birthRecord.id}`}
                          className="text-primary hover:underline"
                        >
                          Télécharger PDF
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* My processing */}
      {mine.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">
              Mes dossiers en cours
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
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {mine.map((b) => (
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
                    <td className="px-4 py-3 text-right">
                      {b.status === "PROCESSING" && (
                        <Link
                          href={`/dashboard/city-hall/births/${b.id}`}
                          className="text-primary hover:underline"
                        >
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
