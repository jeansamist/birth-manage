import Link from "next/link"
import {
  ArrowRightLeftIcon,
  BadgeCheckIcon,
  Building2Icon,
  FileSearchIcon,
  LandmarkIcon,
  SearchIcon,
} from "lucide-react"
import { findCitizenRecord, requestBirthTransfer } from "@/app/actions/citizen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { prisma } from "@/lib/prisma"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date)
}

function messageFromCode(code?: string) {
  switch (code) {
    case "request-created":
      return "Demande envoyée. Le maire de la mairie de naissance doit maintenant l’approuver."
    case "pending":
      return "Une demande de transfert vers cette mairie est déjà en attente."
    case "already-available":
      return "Une copie de cet acte est déjà disponible dans cette mairie."
    default:
      return null
  }
}

function errorFromCode(code?: string) {
  switch (code) {
    case "missing-code":
      return "Veuillez saisir l’identifiant unique partagé par la mairie."
    case "missing-fields":
      return "Veuillez renseigner la mairie cible et votre nom complet."
    case "not-found":
      return "Aucun acte approuvé ne correspond à cet identifiant."
    case "same-city-hall":
      return "L’acte est déjà disponible dans sa mairie d’origine."
    case "target-not-found":
      return "La mairie sélectionnée n’est pas disponible."
    default:
      return null
  }
}

export default async function CitizenPortal({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; success?: string; error?: string }>
}) {
  const params = await searchParams
  const accessId = params.code?.trim().toUpperCase() ?? ""
  const successMessage = messageFromCode(params.success)
  const errorMessage = errorFromCode(params.error)

  const [birth, cityHalls] = await Promise.all([
    accessId
      ? prisma.birthRecord.findUnique({
          where: { citizenAccessId: accessId },
          include: {
            cityHall: {
              select: { id: true, name: true, city: true, address: true },
            },
            hospital: { select: { name: true, city: true } },
            copies: {
              include: {
                cityHall: {
                  select: { id: true, name: true, city: true, address: true },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            transferRequests: {
              include: {
                targetCityHall: { select: { name: true, city: true } },
              },
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        })
      : null,
    prisma.cityHall.findMany({
      where: { isActive: true },
      orderBy: [{ city: "asc" }, { name: "asc" }],
      select: { id: true, name: true, city: true },
    }),
  ])

  const approvedBirth = birth?.status === "APPROVED" ? birth : null
  const unavailableTargetIds = new Set(
    [
      approvedBirth?.cityHallId,
      ...(approvedBirth?.copies.map((copy) => copy.cityHallId) ?? []),
    ].filter(Boolean)
  )

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <FileSearchIcon className="size-5" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Portail citoyen
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Suivi et transfert d’acte de naissance
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Authentifiez-vous avec l’identifiant unique remis après la
                signature du maire pour vérifier la présence de votre acte et
                demander le transfert d’une copie vers une autre mairie.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Espace agents</Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SearchIcon className="size-4" /> Vérifier mon acte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={findCitizenRecord}
              className="grid gap-3 md:grid-cols-[1fr_auto]"
            >
              <div className="space-y-1.5">
                <Label htmlFor="accessId">Identifiant unique citoyen</Label>
                <Input
                  id="accessId"
                  name="accessId"
                  defaultValue={accessId}
                  placeholder="Ex. CID-2026-ABC-12345678"
                  className="uppercase"
                />
              </div>
              <Button type="submit" className="self-end">
                Rechercher
              </Button>
            </form>
            {successMessage && (
              <p className="mt-4 rounded-md bg-green-500/10 px-3 py-2 text-xs text-green-700 dark:text-green-300">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
          </CardContent>
        </Card>

        {accessId && !approvedBirth && !errorMessage && (
          <Card>
            <CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
              <FileSearchIcon className="size-5" /> Aucun acte approuvé ne
              correspond à cet identifiant.
            </CardContent>
          </Card>
        )}

        {approvedBirth && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3 text-base">
                    Acte approuvé
                    <Badge className="bg-green-600 text-white">
                      <BadgeCheckIcon className="size-3" /> Signé
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                  <Info
                    label="Enfant"
                    value={
                      `${approvedBirth.babyFirstName ?? ""} ${approvedBirth.babyLastName ?? ""}`.trim() ||
                      "—"
                    }
                  />
                  <Info
                    label="Date de naissance"
                    value={formatDate(approvedBirth.birthDate)}
                  />
                  <Info
                    label="N° d’acte"
                    value={approvedBirth.certificateNumber ?? "—"}
                  />
                  <Info
                    label="Identifiant citoyen"
                    value={approvedBirth.citizenAccessId ?? "—"}
                  />
                  <Info
                    label="Hôpital déclarant"
                    value={`${approvedBirth.hospital.name} · ${approvedBirth.hospital.city}`}
                  />
                  <Info
                    label="Mairie d’origine"
                    value={`${approvedBirth.cityHall?.name ?? "—"} · ${approvedBirth.cityHall?.city ?? "—"}`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <LandmarkIcon className="size-4" /> Mairies où l’acte est
                    disponible
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {approvedBirth.cityHall && (
                    <AvailabilityRow
                      title={approvedBirth.cityHall.name}
                      subtitle={`${approvedBirth.cityHall.city}${approvedBirth.cityHall.address ? ` · ${approvedBirth.cityHall.address}` : ""}`}
                      badge="Original"
                    />
                  )}
                  {approvedBirth.copies.map((copy) => (
                    <AvailabilityRow
                      key={copy.id}
                      title={copy.cityHall.name}
                      subtitle={`${copy.cityHall.city}${copy.cityHall.address ? ` · ${copy.cityHall.address}` : ""}`}
                      badge="Copie"
                    />
                  ))}
                </CardContent>
              </Card>
            </section>

            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ArrowRightLeftIcon className="size-4" /> Demander un
                    transfert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={requestBirthTransfer} className="space-y-4">
                    <input type="hidden" name="accessId" value={accessId} />
                    <div className="space-y-1.5">
                      <Label htmlFor="requesterName">
                        Nom complet du demandeur
                      </Label>
                      <Input
                        id="requesterName"
                        name="requesterName"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="requesterPhone">Téléphone</Label>
                      <Input
                        id="requesterPhone"
                        name="requesterPhone"
                        placeholder="Optionnel"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="targetCityHallId">Mairie cible</Label>
                      <NativeSelect
                        id="targetCityHallId"
                        name="targetCityHallId"
                        className="w-full"
                        required
                      >
                        <NativeSelectOption value="">
                          Sélectionner une mairie
                        </NativeSelectOption>
                        {cityHalls.map((cityHall) => (
                          <NativeSelectOption
                            key={cityHall.id}
                            value={cityHall.id}
                            disabled={unavailableTargetIds.has(cityHall.id)}
                          >
                            {cityHall.name} · {cityHall.city}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reason">Motif</Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        rows={3}
                        placeholder="Optionnel"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Envoyer la demande
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Demandes récentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {approvedBirth.transferRequests.length === 0 ? (
                    <p className="text-muted-foreground">
                      Aucune demande de transfert.
                    </p>
                  ) : (
                    approvedBirth.transferRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">
                            {request.targetCityHall.name}
                          </span>
                          <TransferBadge status={request.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {request.targetCityHall.city} ·{" "}
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function AvailabilityRow({
  title,
  subtitle,
  badge,
}: {
  title: string
  subtitle: string
  badge: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div className="flex items-center gap-3">
        <Building2Icon className="size-4 text-muted-foreground" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Badge variant="outline">{badge}</Badge>
    </div>
  )
}

function TransferBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return <Badge className="bg-green-600 text-white">Approuvée</Badge>
  }
  if (status === "DECLINED") {
    return <Badge variant="destructive">Refusée</Badge>
  }
  return <Badge variant="outline">En attente</Badge>
}
