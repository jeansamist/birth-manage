import Link from "next/link"
import Image from "next/image"
import {
  FileSearchIcon,
  ShieldCheckIcon,
  GlobeIcon,
  FileTextIcon,
  ClockIcon,
} from "lucide-react"
import { findCitizenRecord, requestBirthTransfer } from "@/app/actions/citizen"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { SearchHero } from "./_components/search-hero"
import { TimelineSection } from "./_components/timeline-section"
import { RecordDetails } from "./_components/record-details"
import { AvailabilityList } from "./_components/availability-list"
import { TransferRequestForm } from "./_components/transfer-request-form"
import { RecentTransfers } from "./_components/recent-transfers"
import FaqSection from "@/components/mvpblocks/faq-3"

export default async function CitizenPortal({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string
    mother?: string
    success?: string
    error?: string
  }>
}) {
  const params = await searchParams
  const accessId = params.code?.trim().toUpperCase() ?? ""
  const motherLastName = params.mother?.trim().toUpperCase() ?? ""
  let successMessage = params.success ? getSuccessMsg(params.success) : null
  let errorMessage = params.error ? getErrorMsg(params.error) : null

  const [rawBirth, cityHalls] = await Promise.all([
    accessId
      ? prisma.birthRecord.findUnique({
          where: { certificateNumber: accessId },
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

  let birth = null
  if (accessId) {
    if (
      rawBirth &&
      rawBirth.motherLastName?.trim().toUpperCase() === motherLastName
    ) {
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
    <div className="w-full min-h-screen bg-muted/20 flex flex-col">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className={cn("space-y-16 w-full", {
          "min-h-[70vh] flex flex-col justify-center": !accessId
        })}>
          {/* Hero Section & Search Form */}
          <div className={cn("space-y-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700", {
            "max-w-3xl mx-auto": !accessId
          })}>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Portail Citoyen
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Gestion sécurisée et vérification de vos documents d'état civil.
              </p>
            </div>
            <SearchHero
              defaultValue={accessId}
              defaultMotherValue={motherLastName}
              action={findCitizenRecord}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          </div>

          {/* Searched Record Content */}
          {accessId && birth && (
            <div className="animate-in space-y-12 duration-500 fade-in zoom-in-95">
              {birth.status !== "APPROVED" ? (
                <div className="mx-auto max-w-2xl bg-card rounded-3xl p-8 border border-border shadow-sm">
                  <TimelineSection birth={birth} />
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
                  <div className="space-y-8">
                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                      <RecordDetails birth={approvedBirth!} />
                    </div>
                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                      <AvailabilityList birth={approvedBirth!} />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                      <TransferRequestForm
                        accessId={accessId}
                        action={requestBirthTransfer}
                        cityHalls={cityHalls}
                        unavailableTargetIds={unavailableTargetIds}
                      />
                    </div>
                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                      <RecentTransfers
                        transferRequests={approvedBirth!.transferRequests}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Institutional Partners / Logo section */}
          {!accessId && (
            <div className="space-y-8 border-t border-border pt-16 text-center">
              <p className="text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                Partenaires Institutionnels
              </p>
              <div className="flex flex-wrap items-center justify-center gap-16 opacity-60 select-none">
                {/* [Logos remain the same, just keeping the structure] */}
                {[
                  { src: "/bunec-logo.png", alt: "BUNEC Logo", label: "BUNEC" },
                  { src: "/logo-minat.jpg", alt: "MINAT Logo", label: "MINAT" },
                  { src: "/logo-minsante.jpg", alt: "MINSANTE Logo", label: "MINSANTE" },
                  { src: "/cameroon-logo.png", alt: "DGSN / Cameroun Logo", label: "DGSN / PR" },
                ].map((logo) => (
                  <div key={logo.label} className="flex flex-col items-center gap-3">
                    <div className="relative h-14 w-14 grayscale hover:grayscale-0 transition-all duration-500">
                      <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-foreground/60 uppercase">
                      {logo.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {!accessId && <FaqSection />}
        </div>
      </div>
    </div>
  )
}

function getSuccessMsg(code: string) {
  if (code === "request-created")
    return "Votre demande de transfert a été enregistrée avec succès. Elle est en attente de validation par le maire."
  if (code === "pending")
    return "Une demande de transfert vers cette mairie est déjà en cours de traitement."
  if (code === "already-available")
    return "Une copie certifiée de cet acte de naissance est déjà disponible dans cette mairie."
  return null
}

function getErrorMsg(code: string) {
  if (code === "missing-code")
    return "Veuillez saisir votre numéro de certificat pour lancer la recherche."
  if (code === "missing-fields")
    return "Veuillez renseigner tous les champs requis pour lancer la recherche."
  if (code === "not-found")
    return "Aucun dossier trouvé pour ce numéro de certificat et ce nom de mère."
  if (code === "same-city-hall")
    return "Cet acte est déjà présent dans cette mairie d'origine."
  if (code === "target-not-found")
    return "La mairie destinataire demandée n'existe pas ou est inactive."
  return "Une erreur est survenue."
}
