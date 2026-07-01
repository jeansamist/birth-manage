import Link from "next/link"
import { FileSearchIcon } from "lucide-react"
import { findCitizenRecord, requestBirthTransfer } from "@/app/actions/citizen"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { SearchHero } from "./_components/search-hero"
import { TimelineSection } from "./_components/timeline-section"
import { RecordDetails } from "./_components/record-details"
import { AvailabilityList } from "./_components/availability-list"
import { TransferRequestForm } from "./_components/transfer-request-form"
import { RecentTransfers } from "./_components/recent-transfers"

export default async function CitizenPortal({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; success?: string; error?: string }>
}) {
  const params = await searchParams
  const accessId = params.code?.trim().toUpperCase() ?? ""
  const motherLastName = params.mother?.trim().toUpperCase() ?? ""
  let successMessage = params.success ? getSuccessMsg(params.success) : null
  let errorMessage = params.error ? getErrorMsg(params.error) : null

  const [rawBirth, cityHalls] = await Promise.all([
    accessId
      ? prisma.birthRecord.findUnique({
          where: { citizenAccessId: accessId },
          include: {
            cityHall: { select: { id: true, name: true, city: true, address: true } },
            hospital: { select: { name: true, city: true } },
            copies: {
              include: { cityHall: { select: { id: true, name: true, city: true, address: true } } },
              orderBy: { createdAt: "desc" },
            },
            transferRequests: {
              include: { targetCityHall: { select: { name: true, city: true } } },
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

  let birth = null
  if (accessId) {
    if (rawBirth && rawBirth.motherLastName?.trim().toUpperCase() === motherLastName) {
      birth = rawBirth
    } else {
      errorMessage = getErrorMsg("not-found")
    }
  }

  const approvedBirth = birth?.status === "APPROVED" ? birth : null
  const unavailableTargetIds = new Set(
    [
      approvedBirth?.cityHallId,
      ...(approvedBirth?.copies.map((copy) => copy.cityHallId) ?? []),
    ].filter((id): id is string => !!id)
  )

  return (
    <main className="min-h-screen bg-muted/10 px-4 py-8 md:py-12 flex justify-center items-start">
      <div className="w-full max-w-[1000px] space-y-6">
        <header className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <FileSearchIcon className="size-5" />
              <span className="text-[10px] uppercase tracking-wider">République du Cameroun</span>
            </div>
            <h1 className="text-lg font-bold">Portail National de l'État Civil</h1>
          </div>
          <Button asChild variant="outline" className="h-10 px-5 rounded-xl font-semibold cursor-pointer">
            <Link href="/auth/login">Espace Agents</Link>
          </Button>
        </header>

        <SearchHero
          defaultValue={accessId}
          defaultMotherValue={motherLastName}
          action={findCitizenRecord}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />

        {accessId && birth && birth.status !== "APPROVED" && (
          <TimelineSection birth={birth} />
        )}

        {approvedBirth && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RecordDetails birth={approvedBirth} />
              <AvailabilityList birth={approvedBirth} />
            </div>
            <div className="space-y-6">
              <TransferRequestForm
                accessId={accessId}
                action={requestBirthTransfer}
                cityHalls={cityHalls}
                unavailableTargetIds={unavailableTargetIds}
              />
              <RecentTransfers transferRequests={approvedBirth.transferRequests} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function getSuccessMsg(code: string) {
  if (code === "request-created") return "Votre demande de transfert a été enregistrée avec succès. Elle est en attente de validation par le maire."
  if (code === "pending") return "Une demande de transfert vers cette mairie est déjà en cours de traitement."
  if (code === "already-available") return "Une copie certifiée de cet acte de naissance est déjà disponible dans cette mairie."
  return null
}

function getErrorMsg(code: string) {
  if (code === "missing-code") return "Veuillez saisir votre identifiant unique citoyen pour lancer la recherche."
  if (code === "missing-fields") return "Veuillez renseigner tous les champs requis pour le transfert."
  if (code === "not-found") return "Aucune déclaration validée n'a été trouvée pour cet identifiant."
  if (code === "same-city-hall") return "Cet acte est déjà présent dans cette mairie d'origine."
  if (code === "target-not-found") return "La mairie destinataire demandée n'existe pas ou est inactive."
  return "Une erreur est survenue."
}
