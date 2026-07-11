import { findCitizenRecord, requestBirthTransfer } from "@/app/actions/citizen"
import FaqSection from "@/components/mvpblocks/faq-3"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import {
  ArrowRightLeftIcon,
  BadgeCheckIcon,
  FileSearchIcon,
  SearchIcon,
} from "lucide-react"
import Image from "next/image"
import type { ComponentType } from "react"
import { AvailabilityList } from "./_components/availability-list"
import { RecentTransfers } from "./_components/recent-transfers"
import { RecordDetails } from "./_components/record-details"
import { SearchHero } from "./_components/search-hero"
import { TimelineSection } from "./_components/timeline-section"
import { TransferRequestForm } from "./_components/transfer-request-form"

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
  const successMessage = params.success ? getSuccessMsg(params.success) : null
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
  const childName = approvedBirth
    ? `${approvedBirth.babyFirstName ?? ""} ${approvedBirth.babyLastName ?? ""}`.trim()
    : ""
  const unavailableTargetIds = new Set(
    [
      approvedBirth?.cityHallId,
      ...(approvedBirth?.copies.map((copy) => copy.cityHallId) ?? []),
    ].filter((id): id is string => !!id)
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-8">
        <div
          className={cn("w-full space-y-16", {
            "flex min-h-[65vh] flex-col justify-center": !accessId,
          })}
        >
          {/* Hero Section & Search Form */}
          <div
            className={cn(
              "w-full animate-in duration-700 fade-in slide-in-from-bottom-6",
              { "mx-auto max-w-3xl": !accessId }
            )}
          >
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
            <div className="animate-in space-y-8 duration-500 zoom-in-95 fade-in">
              {birth.status !== "APPROVED" ? (
                <div className="mx-auto max-w-2xl">
                  <TimelineSection birth={birth} />
                </div>
              ) : (
                <>
                  {/* Record found summary banner */}
                  <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <BadgeCheckIcon className="size-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                          Acte trouvé & certifié
                        </p>
                        <p className="text-lg font-extrabold text-foreground">
                          {childName || "Dossier localisé"}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-background/60 px-4 py-2 font-mono text-xs font-semibold text-muted-foreground">
                      {birth.certificateNumber}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                    <div className="space-y-8">
                      <RecordDetails birth={approvedBirth!} />
                      <AvailabilityList birth={approvedBirth!} />
                    </div>
                    <div className="space-y-8">
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
                </>
              )}
            </div>
          )}

          {/* How it works — shown only before a search */}
          {!accessId && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <HowItWorksStep
                icon={SearchIcon}
                step="1"
                title="Recherchez"
                description="Saisissez le numéro de certificat et le nom de famille de la mère."
              />
              <HowItWorksStep
                icon={FileSearchIcon}
                step="2"
                title="Consultez"
                description="Visualisez le statut du dossier et les mairies détentrices d'une copie."
              />
              <HowItWorksStep
                icon={ArrowRightLeftIcon}
                step="3"
                title="Agissez"
                description="Demandez son transfert vers une autre mairie."
              />
            </div>
          )}

          {/* Institutional Partners / Logo section */}
          {!accessId && (
            <div className="space-y-8 border-t border-border pt-16 text-center">
              <p className="text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                Partenaires Institutionnels
              </p>
              <div className="flex flex-wrap items-center justify-center gap-16 opacity-60 select-none">
                {[
                  { src: "/bunec-logo.png", alt: "BUNEC Logo", label: "BUNEC" },
                  { src: "/logo-minat.jpg", alt: "MINAT Logo", label: "MINAT" },
                  {
                    src: "/logo-minsante.jpg",
                    alt: "MINSANTE Logo",
                    label: "MINSANTE",
                  },
                  {
                    src: "/cameroon-logo.png",
                    alt: "DGSN / Cameroun Logo",
                    label: "DGSN / PR",
                  },
                ].map((logo) => (
                  <div
                    key={logo.label}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative h-14 w-14 grayscale transition-all duration-500 hover:grayscale-0">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
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

function HowItWorksStep({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>
  step: string
  title: string
  description: string
}) {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 shadow-sm">
      <span className="absolute top-5 right-5 text-3xl font-black text-muted-foreground/10">
        {step}
      </span>
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="mt-4 text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
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
