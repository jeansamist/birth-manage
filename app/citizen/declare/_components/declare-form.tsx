"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { DocumentPreview } from "@/components/form/document-preview"
import { finalizeCitizenDeclaration } from "@/app/actions/citizen"
import { MotherFields } from "./mother-fields"
import { FatherFields } from "./father-fields"
import { MarriageFields } from "./marriage-fields"

const parentDeclareSchema = z.object({
  motherProfession: z.string().optional(),
  motherNationality: z.string().optional(),
  motherCni: z.string().optional(),
  motherAddress: z.string().optional(),
  motherPhone: z.string().optional(),
  
  fatherFirstName: z.string().optional(),
  fatherLastName: z.string().optional(),
  fatherBirthDate: z.string().optional(),
  fatherNationality: z.string().optional(),
  fatherProfession: z.string().optional(),
  fatherCni: z.string().optional(),
  fatherAddress: z.string().optional(),
  fatherPhone: z.string().optional(),
  
  parentsMarried: z.boolean(),
  marriageCertNumber: z.string().optional(),
  marriageDate: z.string().optional(),
})

type ParentDeclareInput = z.infer<typeof parentDeclareSchema>

interface DeclareFormProps {
  birth: any
}

export function DeclareForm({ birth }: DeclareFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ParentDeclareInput>({
    resolver: zodResolver(parentDeclareSchema),
    defaultValues: {
      motherProfession: birth.motherProfession || "",
      motherNationality: birth.motherNationality || "Camerounaise",
      motherCni: birth.motherCni || "",
      motherAddress: birth.motherAddress || "",
      motherPhone: birth.motherPhone || "",
      
      fatherFirstName: birth.fatherFirstName || "",
      fatherLastName: birth.fatherLastName || "",
      fatherBirthDate: birth.fatherBirthDate ? new Date(birth.fatherBirthDate).toISOString().split("T")[0] : "",
      fatherNationality: birth.fatherNationality || "Camerounaise",
      fatherProfession: birth.fatherProfession || "",
      fatherCni: birth.fatherCni || "",
      fatherAddress: birth.fatherAddress || "",
      fatherPhone: birth.fatherPhone || "",
      
      parentsMarried: birth.parentsMarried || false,
      marriageCertNumber: birth.marriageCertNumber || "",
      marriageDate: birth.marriageDate ? new Date(birth.marriageDate).toISOString().split("T")[0] : "",
    },
  })

  const formValues = form.watch()

  async function onSubmit(data: ParentDeclareInput) {
    try {
      setIsSubmitting(true)
      await finalizeCitizenDeclaration(birth.id, data)
      router.push(`/citizen/track?code=${birth.citizenTrackingCode}&success=completed`)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Build real-time preview data
  const previewData = {
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
    
    motherFirstName: birth.motherFirstName,
    motherLastName: birth.motherLastName,
    motherBirthDate: birth.motherBirthDate,
    motherNationality: formValues.motherNationality,
    motherCni: formValues.motherCni,
    motherProfession: formValues.motherProfession,
    motherAddress: formValues.motherAddress,
    motherPhone: formValues.motherPhone,
    
    fatherFirstName: formValues.fatherFirstName,
    fatherLastName: formValues.fatherLastName,
    fatherBirthDate: formValues.fatherBirthDate,
    fatherNationality: formValues.fatherNationality,
    fatherCni: formValues.fatherCni,
    fatherProfession: formValues.fatherProfession,
    fatherAddress: formValues.fatherAddress,
    fatherPhone: formValues.fatherPhone,
    
    parentsMarried: formValues.parentsMarried,
    marriageCertNumber: formValues.marriageCertNumber,
    marriageDate: formValues.marriageDate,
    
    declarationRef: birth.declarationRef || "DEC-2026-LA-PENDING",
    cityHallName: birth.cityHall?.name || "Mairie de Yaoundé I",
    cityHallCity: birth.cityHall?.city || "Yaoundé",
    hospitalName: birth.hospital?.name || "Centre de Santé",
    approvedAt: birth.approvedAt,
    maireName: birth.maireName,
    secretaireName: birth.secretaireName,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-background">
      <div className="w-full flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden bg-background">
        {/* Form panel (42%) */}
        <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border xl:w-[42%] h-full overflow-y-auto">
          <div className="px-6 py-4 border-b border-border bg-neutral-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Complétion civile de la déclaration
            </h2>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
              Veuillez compléter les informations civiles de l'acte de naissance de l'enfant. Les informations médicales saisies par le médecin sont verrouillées à droite.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            <MotherFields form={form} />
            <FatherFields form={form} />
            <MarriageFields form={form} />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-neutral-800 hover:bg-neutral-900 text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Enregistrement en cours..." : "Finaliser ma déclaration citoyenne"}
            </Button>
          </form>
        </main>

        {/* Live Preview panel (58%) - Large, spaced A4 with max-w-[820px] */}
        <aside className="hidden xl:flex xl:w-[58%] flex-col min-w-0 bg-neutral-100 dark:bg-neutral-900/50 h-full overflow-y-auto p-10 md:p-12 items-center justify-start border-l border-neutral-200">
          <div className="w-full max-w-[820px] space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <span>Aperçu de la déclaration (Section 3 & 4)</span>
              <span className="text-green-600 bg-green-500/10 px-2 py-0.5 rounded-sm">Rendu dynamique</span>
            </div>
            <DocumentPreview type="declaration" data={previewData} />
          </div>
        </aside>
      </div>
    </div>
  )
}
