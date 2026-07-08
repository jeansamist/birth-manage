import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BabySummary } from "./_components/baby-summary"
import { MedicalSummary } from "./_components/medical-summary"
import { MotherSummary } from "./_components/mother-summary"
import { FatherSummary } from "./_components/father-summary"
import { MarriageSummary } from "./_components/marriage-summary"
import { ApproveDeclinePanel } from "./_components/approve-decline-panel"
import { DocumentPreview, type PreviewData } from "@/components/form/document-preview"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"

export default async function MaireReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || session.role !== "MAIRE") redirect("/dashboard")

  const [birth, user] = await Promise.all([
    prisma.birthRecord.findUnique({
      where: { id },
      include: {
        hospital: true,
        doctor: { select: { firstName: true, lastName: true } },
        secretaire: { select: { firstName: true, lastName: true } },
        cityHall: { select: { name: true, city: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true },
    })
  ])

  if (!birth || birth.status !== "PENDING_APPROVAL" || birth.cityHallId !== session.institutionId) {
    notFound()
  }

  const maireFullName = user ? `${user.firstName} ${user.lastName}` : "SIMON BIYA"
  const secretaireFullName = birth.secretaire ? `${birth.secretaire.firstName} ${birth.secretaire.lastName}` : "MBUYI CECILE"

  const previewData: PreviewData = {
    babyFirstName: birth.babyFirstName,
    babyLastName: birth.babyLastName,
    babyGender: birth.babyGender,
    birthDate: birth.birthDate,
    birthTime: birth.birthTime,
    birthPlace: birth.birthPlace || (birth.hospital ? `${birth.hospital.name}, ${birth.hospital.city}` : null),
    weightGrams: birth.weightGrams,
    heightCm: birth.heightCm,
    apgarScore: birth.apgarScore,
    deliveryType: birth.deliveryType,
    
    // Mère
    motherFirstName: birth.motherFirstName,
    motherLastName: birth.motherLastName,
    motherBirthDate: birth.motherBirthDate,
    motherNationality: birth.motherNationality || "Camerounaise",
    motherCni: birth.motherCni,
    motherProfession: birth.motherProfession,
    motherAddress: birth.motherAddress,
    motherPhone: birth.motherPhone,
    motherEmail: birth.motherEmail,
    
    // Père
    fatherFirstName: birth.fatherFirstName,
    fatherLastName: birth.fatherLastName,
    fatherBirthDate: birth.fatherBirthDate,
    fatherNationality: birth.fatherNationality || "Camerounaise",
    fatherCni: birth.fatherCni,
    fatherProfession: birth.fatherProfession,
    fatherAddress: birth.fatherAddress,
    fatherPhone: birth.fatherPhone,
    
    // Mariage
    parentsMarried: birth.parentsMarried,
    marriageCertNumber: birth.marriageCertNumber,
    marriageDate: birth.marriageDate,
    
    // Métadonnées Mairie
    certificateNumber: birth.certificateNumber || "ACN-2026-LA-PENDING",
    cityHallName: birth.cityHall?.name || "Mairie de Yaoundé I",
    cityHallCity: birth.cityHall?.city || "Yaoundé",
    maireName: maireFullName,
    secretaireName: secretaireFullName,
    qrCodeUrl: birth.citizenAccessId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}` : null,
    declarationRef: birth.declarationRef,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-background">
      <div className="w-full flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden bg-background">
        {/* Formulaire et examens à gauche (50%) */}
        <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border xl:w-1/2 h-full">
          <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/maire"
                className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <ArrowLeftIcon className="size-3.5 mr-1" />
                Retour
              </Link>
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                  Officier d'État Civil · Maire
                </span>
                <h2 className="text-sm font-bold tracking-tight text-neutral-800 uppercase">
                  Examen et signature du dossier
                </h2>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {/* Informations de l'hôpital en lecture seule */}
            <div className="rounded-md border border-border bg-muted/20 p-5 space-y-3 shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Informations d'Origine / Origin details
              </h3>
              <p className="text-[10px] text-neutral-500 font-medium">
                Établissement hospitalier : <span className="text-neutral-800 uppercase font-bold">{birth.hospital?.name}</span> · Agent d'État Civil : <span className="text-neutral-800 font-semibold">{secretaireFullName}</span>
              </p>
            </div>

            {/* Sommaires des informations */}
            <div className="space-y-6 flex-1">
              <BabySummary birth={birth} />
              <MedicalSummary birth={birth} />
              <MotherSummary birth={birth} />
              <FatherSummary birth={birth} />
              <MarriageSummary birth={birth} />
            </div>

            <ApproveDeclinePanel birthId={birth.id} />
          </div>
        </main>

        {/* Aperçu de l'acte officiel à droite (50%) */}
        <div className="hidden xl:flex xl:w-1/2 shrink-0 bg-muted/10 p-8 overflow-y-auto border-l border-border select-none items-start justify-center">
          <div className="w-full max-w-[780px]">
            <p className="mb-4 text-[9px] font-bold tracking-wider text-neutral-400 uppercase text-center">
              Aperçu de l'Acte de Naissance Officiel (Généré en temps réel)
            </p>
            <div className="border shadow-lg rounded-sm overflow-hidden bg-white">
              <DocumentPreview type="certificate" data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
