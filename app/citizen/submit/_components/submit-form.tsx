"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { DocumentPreview } from "@/components/form/document-preview"
import { FileUploadItem } from "@/components/motion/file-upload"
import { submitCitizenDeclaration } from "@/app/actions/citizen"
import { CityHallSelector } from "./cityhall-selector"
import { BabyFields } from "./baby-fields"
import { MotherFields } from "./mother-fields"
import { FatherFields } from "./father-fields"
import { MarriageFields } from "./marriage-fields"
import { FnuUploader } from "./fnu-uploader"

const submitDeclarationSchema = z.object({
  babyFirstName: z.string().min(1, "Prénom de l'enfant requis"),
  babyLastName: z.string().min(1, "Nom de l'enfant requis"),
  babyGender: z.enum(["MALE", "FEMALE"]),
  birthDate: z.string().min(1, "Date de naissance requise"),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  
  motherFirstName: z.string().min(1, "Prénom de la mère requis"),
  motherLastName: z.string().min(1, "Nom de la mère requis"),
  motherBirthDate: z.string().optional(),
  motherNationality: z.string().optional(),
  motherCni: z.string().optional(),
  motherProfession: z.string().optional(),
  motherAddress: z.string().optional(),
  motherPhone: z.string().optional(),
  motherEmail: z.string().optional(),
  
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
  
  cityHallId: z.string().min(1, "Mairie de destination requise"),
})

type SubmitDeclarationInput = z.infer<typeof submitDeclarationSchema>

interface SubmitFormProps {
  cityHalls: { id: string; name: string; city: string }[]
}

export function SubmitForm({ cityHalls }: SubmitFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<FileUploadItem[]>([])

  const form = useForm<SubmitDeclarationInput>({
    resolver: zodResolver(submitDeclarationSchema),
    defaultValues: {
      babyFirstName: "",
      babyLastName: "",
      babyGender: "MALE",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      
      motherFirstName: "",
      motherLastName: "",
      motherBirthDate: "",
      motherNationality: "Camerounaise",
      motherCni: "",
      motherProfession: "",
      motherAddress: "",
      motherPhone: "",
      motherEmail: "",
      
      fatherFirstName: "",
      fatherLastName: "",
      fatherBirthDate: "",
      fatherNationality: "Camerounaise",
      fatherProfession: "",
      fatherCni: "",
      fatherAddress: "",
      fatherPhone: "",
      
      parentsMarried: false,
      marriageCertNumber: "",
      marriageDate: "",
      
      cityHallId: "",
    },
  })

  const formValues = form.watch()

  async function onSubmit(data: SubmitDeclarationInput) {
    try {
      setIsSubmitting(true)
      const res = await submitCitizenDeclaration(data)
      router.push(`/citizen/track?code=${res.trackingCode}&success=submitted`)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Live preview formatting
  const previewData = {
    babyFirstName: formValues.babyFirstName,
    babyLastName: formValues.babyLastName,
    babyGender: formValues.babyGender,
    birthDate: formValues.birthDate,
    birthTime: formValues.birthTime,
    birthPlace: formValues.birthPlace,
    
    motherFirstName: formValues.motherFirstName,
    motherLastName: formValues.motherLastName,
    motherBirthDate: formValues.motherBirthDate,
    motherNationality: formValues.motherNationality,
    motherCni: formValues.motherCni,
    motherProfession: formValues.motherProfession,
    motherAddress: formValues.motherAddress,
    motherPhone: formValues.motherPhone,
    motherEmail: formValues.motherEmail,
    
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
    
    declarationRef: "FNU-PENDING-SUBMISSION",
    cityHallName: cityHalls.find((c) => c.id === formValues.cityHallId)?.name || "Non sélectionnée",
    cityHallCity: cityHalls.find((c) => c.id === formValues.cityHallId)?.city || "Yaoundé",
    hospitalName: "CLINIQUE HORS-SYSTÈME / OFF-SYSTEM CLINIC",
    approvedAt: null,
    maireName: null,
    secretaireName: null,
    citizenTrackingCode: "TRK-PENDING",
  }

  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-background">
      <div className="w-full flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden bg-background">
        {/* Input Form Panel (42%) */}
        <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border xl:w-[42%] h-full overflow-y-auto">
          <div className="w-full max-w-xl mx-auto px-6 py-6 border-b border-border bg-neutral-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Déclaration de naissance hors-système (FNU)
            </h2>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
              Pour les accouchements à domicile ou dans des centres de santé non reliés au registre numérique. Veuillez saisir les informations et téléverser la feuille FNU.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl mx-auto p-6 md:p-8 space-y-8">
            <CityHallSelector form={form} cityHalls={cityHalls} />
            <BabyFields form={form} />
            <MotherFields form={form} />
            <FatherFields form={form} />
            <MarriageFields form={form} />
            <FnuUploader value={uploadedFiles} onValueChange={setUploadedFiles} />

            <Button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length === 0}
              className="w-full h-10 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-neutral-800 hover:bg-neutral-900 text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Enregistrement en cours..." : "Soumettre la déclaration FNU"}
            </Button>
          </form>
        </main>

        {/* Live Preview Panel - Large, spaced A4 with max-w-[820px] */}
        <aside className="hidden xl:flex xl:w-[58%] flex-col min-w-0 bg-neutral-100 dark:bg-neutral-900/50 h-full overflow-y-auto p-10 md:p-12 items-center justify-start border-l border-neutral-200">
          <div className="w-full max-w-[820px] space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <span>Prévisualisation de la Déclaration</span>
              <span className="text-green-600 bg-green-500/10 px-2 py-0.5 rounded-sm">Rendu en direct</span>
            </div>
            <DocumentPreview type="declaration" data={previewData} />
          </div>
        </aside>
      </div>
    </div>
  )
}
