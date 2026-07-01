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
    <div className={cn("space-y-12 w-full", {
      "min-h-[60vh] flex flex-col justify-center": !accessId
    })}>
      {/* Hero Section & Search Form */}
      <div className={cn("space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500", {
        "max-w-2xl mx-auto my-auto": !accessId
      })}>
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
        <div className="animate-in space-y-6 duration-300 fade-in">
          {birth.status !== "APPROVED" ? (
            <div className="mx-auto max-w-2xl">
              <TimelineSection birth={birth} />
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <RecordDetails birth={approvedBirth!} />
                <AvailabilityList birth={approvedBirth!} />
              </div>
              <div className="space-y-6">
                <TransferRequestForm
                  accessId={accessId}
                  action={requestBirthTransfer}
                  cityHalls={cityHalls}
                  unavailableTargetIds={unavailableTargetIds}
                />
                <RecentTransfers
                  transferRequests={approvedBirth!.transferRequests}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info & Stats Section (Bento layout) */}

      {/* Institutional Partners / Logo section */}
      {!accessId && (
        <div className="space-y-6 border-t border-neutral-200 pt-12 text-center">
          <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            Partenaires Institutionnels / Institutional Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-75 select-none md:gap-16">
            {/* BUNEC */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-12 grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src="/bunec-logo.png"
                  alt="BUNEC Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[8px] font-black tracking-wider text-neutral-600 uppercase">
                BUNEC
              </span>
            </div>

            {/* MINAT */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-12 grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src="/logo-minat.jpg"
                  alt="MINAT Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[8px] font-black tracking-wider text-neutral-600 uppercase">
                MINAT
              </span>
            </div>

            {/* MINSANTE */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-12 grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src="/logo-minsante.jpg"
                  alt="MINSANTE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[8px] font-black tracking-wider text-neutral-600 uppercase">
                MINSANTE
              </span>
            </div>

            {/* DGSN */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-12 grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src="/cameroon-logo.png"
                  alt="DGSN / Cameroun Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[8px] font-black tracking-wider text-neutral-600 uppercase">
                DGSN / PR
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FaqSection />
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
    return "Veuillez saisir votre identifiant unique citoyen pour lancer la recherche."
  if (code === "missing-fields")
    return "Veuillez renseigner tous les champs requis pour lancer la recherche."
  if (code === "not-found")
    return "Aucun dossier trouvé pour cet identifiant et ce nom de mère."
  if (code === "same-city-hall")
    return "Cet acte est déjà présent dans cette mairie d'origine."
  if (code === "target-not-found")
    return "La mairie destinataire demandée n'existe pas ou est inactive."
  return "Une erreur est survenue."
}
