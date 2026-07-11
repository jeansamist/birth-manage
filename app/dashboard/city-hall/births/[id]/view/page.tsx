import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DocumentPreview, type PreviewData } from "@/components/form/document-preview"
import { PrintButton } from "@/components/print-button"
import { PrintArea } from "@/components/print-area"
import { ArrowLeftIcon, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBaseUrl } from "@/lib/utils"

export default async function ViewBirthCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER", "MAIRE"].includes(session.role)) {
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
      copies: {
        where: { cityHallId: session.institutionId || "" }
      }
    },
  })

  // Must be approved to consult it, and belong to the same city hall (or have a copy)
  const isOwner = birth?.cityHallId === session.institutionId
  const hasCopy = birth?.copies && birth.copies.length > 0

  if (!birth || birth.status !== "APPROVED" || (!isOwner && !hasCopy)) {
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
    birthPlace: birth.birthPlace || (birth.hospital ? `${birth.hospital.name}, ${birth.hospital.city}` : null),
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
    hospitalName: birth.hospital?.name,
    approvedAt: birth.approvedAt,
    maireSignatureUrl: birth.maireSignature,
  }

  const backUrl = session.role === "MAIRE" ? "/dashboard/maire?filter=approved" : "/dashboard/city-hall?filter=all"

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f3f3f3] h-full overflow-y-auto">
      {/* Barre d'actions supérieure cachée à l'impression */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-card shrink-0 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 h-8">
            <Link href={backUrl}>
              <ArrowLeftIcon className="size-3.5" />
              Retour
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Consultation d'Acte
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Seule la secrétaire d'état civil peut imprimer et télécharger l'acte signé */}
          {session.role === "SECRETAIRE" && (
            <>
              <PrintButton />
              <Button asChild variant="outline" size="sm" className="gap-2 h-9 text-xs font-bold uppercase tracking-wider cursor-pointer">
                <a href={`/api/certificate/${id}`} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  Télécharger l&apos;acte signé (PDF)
                </a>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Rendu A4 physique */}
      <main className="flex-1 flex items-start justify-center p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-[820px] bg-card rounded-lg border border-border shadow-xl p-8 md:p-12">
          <DocumentPreview type="certificate" data={previewData} />
        </div>
      </main>

      {/* Copie dédiée à l'impression, portée directement sous <body> pour
          échapper au shell du dashboard (sidebar, overflow-hidden...) qui
          empêchait le rendu papier de s'afficher correctement. */}
      <PrintArea>
        <DocumentPreview type="certificate" data={previewData} />
      </PrintArea>
    </div>
  )
}
