import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DocumentPreview, type PreviewData } from "@/components/form/document-preview"
import { PrintButton } from "@/components/print-button"
import { PrintArea } from "@/components/print-area"
import { ArrowLeftIcon, EditIcon, FileCheckIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBaseUrl } from "@/lib/utils"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { ClaimButton } from "../../../_components/claim-button"

export default async function CityHallBirthDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role)) {
    redirect("/dashboard")
  }

  const birth = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      hospital: { select: { name: true, city: true } },
      doctor: { select: { firstName: true, lastName: true } },
      cityHall: { select: { name: true, city: true } },
      secretaire: { select: { firstName: true, lastName: true } },
      maire: { select: { firstName: true, lastName: true } },
    },
  })

  if (!birth || birth.cityHallId !== session.institutionId) {
    notFound()
  }

  const maireName = birth.maire ? `${birth.maire.firstName} ${birth.maire.lastName}` : null
  const secretaireName = birth.secretaire ? `${birth.secretaire.firstName} ${birth.secretaire.lastName}` : null

  const previewData: PreviewData = {
    babyFirstName: birth.babyFirstName,
    babyLastName: birth.babyLastName,
    babyGender: birth.babyGender,
    birthDate: birth.birthDate,
    birthTime: birth.birthTime,
    birthPlace: birth.birthPlace,
    weightGrams: birth.weightGrams,
    apgarScore: birth.apgarScore,
    deliveryType: birth.deliveryType,

    motherFirstName: birth.motherFirstName,
    motherLastName: birth.motherLastName,
    motherBirthDate: birth.motherBirthDate,
    motherNationality: birth.motherNationality || "Camerounaise",
    motherCni: birth.motherCni,
    motherProfession: birth.motherProfession,
    motherAddress: birth.motherAddress,
    motherPhone: birth.motherPhone,
    motherEmail: birth.motherEmail,

    fatherFirstName: birth.fatherFirstName,
    fatherLastName: birth.fatherLastName,
    fatherBirthDate: birth.fatherBirthDate,
    fatherNationality: birth.fatherNationality || "Camerounaise",
    fatherCni: birth.fatherCni,
    fatherProfession: birth.fatherProfession,
    fatherAddress: birth.fatherAddress,
    fatherPhone: birth.fatherPhone,

    parentsMarried: birth.parentsMarried,
    marriageCertNumber: birth.marriageCertNumber,
    marriageDate: birth.marriageDate,

    certificateNumber: birth.certificateNumber || "ACN-2026-LA-PENDING",
    cityHallName: birth.cityHall?.name || "Mairie de Yaoundé I",
    cityHallCity: birth.cityHall?.city || "Yaoundé",
    maireName: maireName || "SIMON BIYA",
    secretaireName: secretaireName || "MBUYI CECILE",
    qrCodeUrl: birth.citizenAccessId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}` : null,
    declarationRef: birth.declarationRef,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  const canClaim = birth.status === "SUBMITTED"
  const canComplete = birth.status === "PROCESSING" && birth.secretaireId === session.userId
  const canViewCertificate = birth.status === "APPROVED"

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f3f3f3] h-full overflow-y-auto">
      {/* Barre d'actions supérieure cachée à l'impression */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white shrink-0 print:hidden shadow-xs">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 h-8">
            <Link href="/dashboard/city-hall?filter=all">
              <ArrowLeftIcon className="size-3.5" />
              Retour
            </Link>
          </Button>
          <div className="h-4 w-px bg-neutral-200" />
          <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
            Détails du Dossier
          </h1>
          <StatusBadge status={birth.status} />
        </div>
        <div className="flex items-center gap-2">
          {canClaim && <ClaimButton birthId={birth.id} />}
          {canComplete && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 h-9 text-xs font-bold uppercase tracking-wider cursor-pointer border-neutral-300">
              <Link href={`/dashboard/city-hall/births/${birth.id}`}>
                <EditIcon className="size-3.5" />
                Compléter
              </Link>
            </Button>
          )}
          {canViewCertificate && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 h-9 text-xs font-bold uppercase tracking-wider cursor-pointer border-neutral-300">
              <Link href={`/dashboard/city-hall/births/${birth.id}/view`}>
                <FileCheckIcon className="size-3.5" />
                Consulter l&apos;acte
              </Link>
            </Button>
          )}
          <PrintButton />
        </div>
      </header>

      {/* Rendu A4 physique */}
      <main className="flex-1 flex items-start justify-center p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-[820px] bg-white rounded-lg border border-neutral-200 shadow-xl p-8 md:p-12">
          <DocumentPreview type="declaration" data={previewData} />
        </div>
      </main>

      {/* Copie dédiée à l'impression, portée directement sous <body> pour
          échapper au shell du dashboard (sidebar, overflow-hidden...) qui
          empêchait le rendu papier de s'afficher correctement. */}
      <PrintArea>
        <DocumentPreview type="declaration" data={previewData} />
      </PrintArea>
    </div>
  )
}
