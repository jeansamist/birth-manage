"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { completeBirthRecord, submitToMaire } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MotherFields } from "./mother-fields"
import { FatherFields } from "./father-fields"
import { MarriageFields } from "./marriage-fields"
import { DocumentPreview, type PreviewData } from "@/components/form/document-preview"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"

interface CompletionData {
  motherCni: string
  motherProfession: string
  motherAddress: string
  motherPhone: string
  fatherFirstName: string
  fatherLastName: string
  fatherCni: string
  fatherProfession: string
  fatherAddress: string
  fatherPhone: string
  parentsMarried: boolean
  marriageCertNumber: string
  marriageDate: string
}

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

export function CompletionForm({ birth }: { birth: any }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CompletionData>({
    defaultValues: {
      motherCni: birth.motherCni ?? "",
      motherProfession: birth.motherProfession ?? "",
      motherAddress: birth.motherAddress ?? "",
      motherPhone: birth.motherPhone ?? "",
      fatherFirstName: birth.fatherFirstName ?? "",
      fatherLastName: birth.fatherLastName ?? "",
      fatherCni: birth.fatherCni ?? "",
      fatherProfession: birth.fatherProfession ?? "",
      fatherAddress: birth.fatherAddress ?? "",
      fatherPhone: birth.fatherPhone ?? "",
      parentsMarried: birth.parentsMarried ?? false,
      marriageCertNumber: birth.marriageCertNumber ?? "",
      marriageDate: birth.marriageDate ? new Date(birth.marriageDate).toISOString().split("T")[0] : "",
    },
  })

  const { handleSubmit } = form
  const formValues = form.watch()

  const onSave = (data: CompletionData) => {
    setServerError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await completeBirthRecord(birth.id, data as any)
      if (!result.success) {
        setServerError(result.error ?? "Erreur lors de la sauvegarde.")
      } else {
        setSaved(true)
      }
    })
  }

  const onSubmitToMaire = () => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitToMaire(birth.id)
      if (result && !result.success) {
        setServerError(result.error ?? "Erreur lors de la soumission.")
      }
    })
  }

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
    motherCni: formValues.motherCni,
    motherProfession: formValues.motherProfession,
    motherAddress: formValues.motherAddress,
    motherPhone: formValues.motherPhone,
    motherEmail: birth.motherEmail,
    
    // Père
    fatherFirstName: formValues.fatherFirstName || birth.fatherFirstName,
    fatherLastName: formValues.fatherLastName || birth.fatherLastName,
    fatherBirthDate: birth.fatherBirthDate,
    fatherNationality: birth.fatherNationality || "Camerounaise",
    fatherCni: formValues.fatherCni,
    fatherProfession: formValues.fatherProfession,
    fatherAddress: formValues.fatherAddress,
    fatherPhone: formValues.fatherPhone,
    
    // Mariage
    parentsMarried: formValues.parentsMarried,
    marriageCertNumber: formValues.marriageCertNumber,
    marriageDate: formValues.marriageDate,
    
    // Métadonnées Mairie
    certificateNumber: birth.certificateNumber || "ACN-2026-LA-PENDING",
    cityHallName: birth.cityHall?.name || "Mairie de Yaoundé I",
    cityHallCity: birth.cityHall?.city || "Yaoundé",
    maireName: birth.maireName || "SIMON BIYA",
    secretaireName: birth.secretaireName || "MBUYI CECILE",
    qrCodeUrl: birth.citizenAccessId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}` : null,
    declarationRef: birth.declarationRef,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-background">
      <div className="w-full flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden bg-background">
        {/* Formulaire à gauche (50%) */}
        <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border xl:w-1/2 h-full">
          <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/city-hall"
                className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-muted/50"
              >
                <ArrowLeftIcon className="size-3.5 mr-1" />
                Retour
              </Link>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  Agent d'État Civil · Traitement de dossier
                </span>
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  Compléter le dossier
                </h2>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit(onSave)} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {/* Informations de l'hôpital en lecture seule */}
            <div className="rounded-md border border-border bg-muted/20 p-5 space-y-3 shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Informations reçues de l'hôpital / Hospital details
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium">
                Établissement : <span className="text-foreground uppercase font-bold">{birth.hospital?.name}</span> · Médecin : <span className="text-foreground font-semibold">Dr. {birth.doctor?.firstName} {birth.doctor?.lastName}</span>
              </p>
              <Separator />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground uppercase text-[9px] font-bold">Enfant / Child</dt>
                  <dd className="font-semibold text-foreground text-sm mt-0.5 uppercase">{birth.babyFirstName} {birth.babyLastName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase text-[9px] font-bold">Sexe / Gender</dt>
                  <dd className="font-semibold text-foreground text-sm mt-0.5">{birth.babyGender === "MALE" ? "Masculin / Male" : "Féminin / Female"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase text-[9px] font-bold">Né le / Born on</dt>
                  <dd className="font-semibold text-foreground text-sm mt-0.5">{fmt(birth.birthDate)} à {birth.birthTime ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase text-[9px] font-bold">Mère / Mother</dt>
                  <dd className="font-semibold text-foreground text-sm mt-0.5 uppercase">{birth.motherFirstName} {birth.motherLastName}</dd>
                </div>
              </dl>
            </div>

            {/* Sections éditables */}
            <div className="space-y-6 flex-1">
              <MotherFields form={form as any} />
              <FatherFields form={form as any} />
              <MarriageFields form={form as any} />
            </div>

            {serverError && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-md px-4 py-2.5 shrink-0 font-medium">{serverError}</p>
            )}
            {saved && (
              <p className="text-xs text-green-700 bg-green-50 rounded-md px-4 py-2.5 font-semibold shrink-0">Dossier sauvegardé avec succès.</p>
            )}

            <div className="pt-4 border-t border-border flex items-center gap-3 shrink-0">
              <Button type="submit" variant="outline" className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer" disabled={isPending}>
                {isPending ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button type="button" className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPending} onClick={onSubmitToMaire}>
                {isPending ? "Envoi..." : "Soumettre au Maire"}
              </Button>
            </div>
          </form>
        </main>

        {/* Aperçu de l'acte officiel à droite (50%) */}
        <div className="hidden xl:flex xl:w-1/2 shrink-0 bg-muted/10 p-8 overflow-y-auto border-l border-border select-none items-start justify-center">
          <div className="w-full max-w-[780px]">
            <p className="mb-4 text-[9px] font-bold tracking-wider text-muted-foreground uppercase text-center">
              Aperçu de l'Acte de Naissance Officiel (Généré en temps réel)
            </p>
            <div className="border shadow-lg rounded-lg overflow-hidden bg-card">
              <DocumentPreview type="certificate" data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
