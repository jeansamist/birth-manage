import Link from "next/link"
import Image from "next/image"
import { FileSearchIcon, ShieldCheckIcon, GlobeIcon, FileTextIcon, ClockIcon } from "lucide-react"
import { findCitizenRecord, requestBirthTransfer } from "@/app/actions/citizen"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
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
  searchParams: Promise<{ code?: string; mother?: string; success?: string; error?: string }>
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
    <div className="space-y-12">
      {/* Hero Section & Search Form */}
      <div className="space-y-6">
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
        <div className="space-y-6 animate-in fade-in duration-300">
          {birth.status !== "APPROVED" ? (
            <div className="max-w-2xl mx-auto">
              <TimelineSection birth={birth} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                <RecentTransfers transferRequests={approvedBirth!.transferRequests} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info & Stats Section (Bento layout) */}
      {!accessId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-md shadow-xs space-y-3">
            <div className="h-9 w-9 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-800">
              <ShieldCheckIcon className="size-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Authenticité Zero-Trust</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Toutes les données sont certifiées cryptographiquement avec un QR code d'authenticité vérifiable en temps réel, garantissant des documents infalsifiables.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-md shadow-xs space-y-3">
            <div className="h-9 w-9 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-800">
              <GlobeIcon className="size-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Mairies Connectées</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Demandez des copies d'actes physiques certifiées et transférez votre dossier instantanément d'une commune à une autre à travers le réseau national.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-md shadow-xs space-y-3">
            <div className="h-9 w-9 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-800">
              <ClockIcon className="size-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Suivi en direct</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Suivez chaque étape de la validation de votre déclaration de naissance (Hôpital ➔ Secrétariat de Mairie ➔ Signature du Maire) en temps réel.
            </p>
          </div>
        </div>
      )}

      {/* Institutional Partners / Logo section */}
      {!accessId && (
        <div className="border-t border-neutral-200 pt-12 text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Partenaires Institutionnels / Institutional Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-75 select-none">
            {/* BUNEC */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src="/bunec-logo.png" alt="BUNEC Logo" fill className="object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-neutral-600">BUNEC</span>
            </div>

            {/* MINAT */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src="/logo-minat.jpg" alt="MINAT Logo" fill className="object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-neutral-600">MINAT</span>
            </div>

            {/* MINSANTE */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src="/logo-minsante.jpg" alt="MINSANTE Logo" fill className="object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-neutral-600">MINSANTE</span>
            </div>

            {/* DGSN */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src="/cameroon-logo.png" alt="DGSN / Cameroun Logo" fill className="object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-neutral-600">DGSN / PR</span>
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
  if (code === "request-created") return "Votre demande de transfert a été enregistrée avec succès. Elle est en attente de validation par le maire."
  if (code === "pending") return "Une demande de transfert vers cette mairie est déjà en cours de traitement."
  if (code === "already-available") return "Une copie certifiée de cet acte de naissance est déjà disponible dans cette mairie."
  return null
}

function getErrorMsg(code: string) {
  if (code === "missing-code") return "Veuillez saisir votre identifiant unique citoyen pour lancer la recherche."
  if (code === "missing-fields") return "Veuillez renseigner tous les champs requis pour lancer la recherche."
  if (code === "not-found") return "Aucun dossier trouvé pour cet identifiant et ce nom de mère."
  if (code === "same-city-hall") return "Cet acte est déjà présent dans cette mairie d'origine."
  if (code === "target-not-found") return "La mairie destinataire demandée n'existe pas ou est inactive."
  return "Une erreur est survenue."
}
