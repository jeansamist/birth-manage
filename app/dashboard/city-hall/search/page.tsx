import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SearchIcon, InboxIcon, DownloadIcon } from "lucide-react"
import type { BirthStatus } from "@/types/birth"
import type { Prisma } from "@/generated/prisma/client"

// Recherche approfondie d'un acte dans la mairie de la secrétaire, par champs
// séparés : chaque champ renseigné doit matcher (combinés en ET).

const STATUS_OPTIONS: { value: BirthStatus; label: string }[] = [
  { value: "SUBMITTED", label: "Soumis" },
  { value: "PROCESSING", label: "En traitement" },
  { value: "PENDING_APPROVAL", label: "En attente signature" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "DECLINED", label: "Refusé" },
]

interface SearchFields {
  childName?: string
  motherName?: string
  fatherName?: string
  hospital?: string
  certificateNumber?: string
  birthPlace?: string
  status?: string
}

const FIELD_CONFIG: {
  name: keyof SearchFields
  label: string
  placeholder: string
}[] = [
  { name: "childName", label: "Nom de l'enfant", placeholder: "Ex : Jael Cain" },
  { name: "motherName", label: "Nom de la mère", placeholder: "Ex : Marie Curie" },
  { name: "fatherName", label: "Nom du père", placeholder: "Ex : Jean-Baptiste" },
  { name: "hospital", label: "Hôpital", placeholder: "Ex : Laquintinie" },
  { name: "certificateNumber", label: "N° d'acte", placeholder: "Ex : ACN-2026" },
  { name: "birthPlace", label: "Lieu de naissance", placeholder: "Ex : Salle B" },
]

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{children}</th>
}
function Td({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-4 py-3 text-xs text-muted-foreground ${mono ? "font-mono" : ""}`}>{children}</td>
}

export default async function CityHallSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchFields>
}) {
  const params = await searchParams
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role))
    redirect("/dashboard")

  const cityHallId = session.institutionId
  if (!cityHallId) redirect("/dashboard")

  const fields: Record<string, string> = {}
  for (const { name } of FIELD_CONFIG) {
    const value = params[name]?.trim()
    if (value) fields[name] = value
  }
  const statusFilter = STATUS_OPTIONS.some((s) => s.value === params.status)
    ? (params.status as BirthStatus)
    : undefined
  const hasCriteria = Object.keys(fields).length > 0 || !!statusFilter

  const conditions: Prisma.BirthRecordWhereInput[] = []
  if (fields.childName) {
    conditions.push({
      OR: [
        { babyFirstName: { contains: fields.childName, mode: "insensitive" } },
        { babyLastName: { contains: fields.childName, mode: "insensitive" } },
      ],
    })
  }
  if (fields.motherName) {
    conditions.push({
      OR: [
        { motherFirstName: { contains: fields.motherName, mode: "insensitive" } },
        { motherLastName: { contains: fields.motherName, mode: "insensitive" } },
      ],
    })
  }
  if (fields.fatherName) {
    conditions.push({
      OR: [
        { fatherFirstName: { contains: fields.fatherName, mode: "insensitive" } },
        { fatherLastName: { contains: fields.fatherName, mode: "insensitive" } },
      ],
    })
  }
  if (fields.hospital) {
    conditions.push({ hospital: { is: { name: { contains: fields.hospital, mode: "insensitive" } } } })
  }
  if (fields.certificateNumber) {
    conditions.push({ certificateNumber: { contains: fields.certificateNumber, mode: "insensitive" } })
  }
  if (fields.birthPlace) {
    conditions.push({ birthPlace: { contains: fields.birthPlace, mode: "insensitive" } })
  }

  const results = hasCriteria
    ? await prisma.birthRecord.findMany({
        where: {
          cityHallId,
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(conditions.length > 0 ? { AND: conditions } : {}),
        },
        orderBy: { updatedAt: "desc" },
        take: 100,
        include: { hospital: { select: { name: true, city: true } } },
      })
    : []

  const canDownload = session.role === "SECRETAIRE"

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
          Recherche d&apos;actes
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Combinez un ou plusieurs critères pour retrouver un dossier de votre mairie.
        </p>
      </div>

      {/* Formulaire GET — état de recherche dans l'URL, partageable */}
      <form method="GET" className="rounded-xl border bg-card p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FIELD_CONFIG.map((f) => (
            <div key={f.name} className="space-y-1">
              <Label htmlFor={f.name} className="text-[11px] text-muted-foreground">
                {f.label}
              </Label>
              <Input
                id={f.name}
                name={f.name}
                defaultValue={params[f.name] ?? ""}
                placeholder={f.placeholder}
                className="h-9"
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor="status" className="text-[11px] text-muted-foreground">
              Statut
            </Label>
            <select
              id="status"
              name="status"
              defaultValue={statusFilter ?? ""}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="">Tous les statuts</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="h-9 px-6 text-xs font-semibold uppercase tracking-wider gap-1.5">
            <SearchIcon className="size-3.5" />
            Rechercher
          </Button>
          {hasCriteria && (
            <Link
              href="/dashboard/city-hall/search"
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Réinitialiser
            </Link>
          )}
        </div>
      </form>

      {/* Résultats */}
      {hasCriteria && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <SearchIcon className="size-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">
              {results.length === 0
                ? "Aucun résultat"
                : `${results.length} résultat${results.length > 1 ? "s" : ""}${results.length === 100 ? " (affinez votre recherche)" : ""}`}
            </span>
          </div>
          <div className="overflow-x-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <InboxIcon className="mb-2 size-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Aucun dossier ne correspond à ces critères dans votre mairie.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <Th>Enfant</Th><Th>Mère</Th><Th>Hôpital</Th><Th>N° acte</Th><Th>Naissance</Th><Th>Statut</Th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {results.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-sm">
                        <Link href={`/dashboard/city-hall/births/${b.id}/details`} className="hover:text-primary hover:underline">
                          {`${b.babyFirstName ?? ""} ${b.babyLastName ?? ""}`.trim() || <span className="text-muted-foreground italic text-xs">Sans nom</span>}
                        </Link>
                      </td>
                      <Td>{`${b.motherFirstName ?? ""} ${b.motherLastName ?? ""}`.trim() || "—"}</Td>
                      <Td>{b.hospital.name}</Td>
                      <Td mono>{b.certificateNumber ?? "—"}</Td>
                      <Td>{formatDate(b.birthDate)}</Td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/dashboard/city-hall/births/${b.id}/details`} className="text-xs font-semibold text-primary hover:underline">
                            Détails
                          </Link>
                          {b.status === "APPROVED" && (
                            <>
                              <Link href={`/dashboard/city-hall/births/${b.id}/view`} className="text-xs font-semibold text-primary hover:underline">
                                Consulter
                              </Link>
                              {canDownload && (
                                <a
                                  href={`/api/certificate/${b.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                >
                                  <DownloadIcon className="size-3" />
                                  PDF
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {!hasCriteria && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-card/50">
          <SearchIcon className="mb-2 size-7 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Renseignez un ou plusieurs champs pour lancer la recherche.
          </p>
        </div>
      )}
    </div>
  )
}
