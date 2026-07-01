"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentPreview } from "@/components/form/document-preview"
import { FileUpload, FileUploadItem } from "@/components/motion/file-upload"
import { submitCitizenDeclaration } from "@/app/actions/citizen"

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
        {/* Input Form Panel */}
        <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border xl:w-1/2 h-full overflow-y-auto">
          <div className="px-6 py-4 border-b border-border bg-neutral-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Déclaration de naissance hors-système (FNU)
            </h2>
            <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
              Pour les accouchements à domicile ou dans des centres de santé non reliés au registre numérique. Veuillez saisir les informations et téléverser la feuille FNU.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* DESTINATION MAIRIE */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                1. Mairie destinataire / Target City Hall
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="cityHallId" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Sélectionner la Mairie</Label>
                <Select
                  value={form.watch("cityHallId")}
                  onValueChange={(val) => form.setValue("cityHallId", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-md">
                    <SelectValue placeholder="Choisir la mairie d'enregistrement" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityHalls.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name} ({c.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.cityHallId && (
                  <p className="text-[10px] text-destructive font-semibold mt-1">{form.formState.errors.cityHallId.message}</p>
                )}
              </div>
            </div>

            {/* BABY SECTION */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                2. L'Enfant / The Child
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="babyLastName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Nom de famille</Label>
                  <Input id="babyLastName" {...form.register("babyLastName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="babyFirstName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Prénoms</Label>
                  <Input id="babyFirstName" {...form.register("babyFirstName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="babyGender" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Sexe</Label>
                  <Select
                    value={form.watch("babyGender")}
                    onValueChange={(val) => form.setValue("babyGender", val as "MALE" | "FEMALE")}
                  >
                    <SelectTrigger className="h-9 text-xs rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE" className="text-xs">Masculin / Male</SelectItem>
                      <SelectItem value="FEMALE" className="text-xs">Féminin / Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="birthDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Date de naissance</Label>
                  <Input id="birthDate" type="date" {...form.register("birthDate")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="birthTime" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Heure de naissance</Label>
                  <Input id="birthTime" type="time" {...form.register("birthTime")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="birthPlace" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Lieu de naissance</Label>
                  <Input id="birthPlace" {...form.register("birthPlace")} placeholder="Ex. Douala V" className="h-9 text-xs rounded-md" />
                </div>
              </div>
            </div>

            {/* MOTHER SECTION */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                3. La Mère / The Mother
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="motherLastName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Nom de famille de la Mère</Label>
                  <Input id="motherLastName" {...form.register("motherLastName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherFirstName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Prénoms de la Mère</Label>
                  <Input id="motherFirstName" {...form.register("motherFirstName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherBirthDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Date de naissance</Label>
                  <Input id="motherBirthDate" type="date" {...form.register("motherBirthDate")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherNationality" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Nationalité</Label>
                  <Input id="motherNationality" {...form.register("motherNationality")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherCni" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">N° CNI / Passeport</Label>
                  <Input id="motherCni" {...form.register("motherCni")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherProfession" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Profession</Label>
                  <Input id="motherProfession" {...form.register("motherProfession")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherPhone" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Téléphone</Label>
                  <Input id="motherPhone" {...form.register("motherPhone")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherEmail" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Email</Label>
                  <Input id="motherEmail" type="email" {...form.register("motherEmail")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="motherAddress" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Adresse & Domicile</Label>
                  <Input id="motherAddress" {...form.register("motherAddress")} className="h-9 text-xs rounded-md" />
                </div>
              </div>
            </div>

            {/* FATHER SECTION */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                4. Le Père / The Father (Optionnel)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fatherLastName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Nom du Père</Label>
                  <Input id="fatherLastName" {...form.register("fatherLastName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherFirstName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Prénoms du Père</Label>
                  <Input id="fatherFirstName" {...form.register("fatherFirstName")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherBirthDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Date de naissance</Label>
                  <Input id="fatherBirthDate" type="date" {...form.register("fatherBirthDate")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherNationality" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Nationalité</Label>
                  <Input id="fatherNationality" {...form.register("fatherNationality")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherProfession" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Profession</Label>
                  <Input id="fatherProfession" {...form.register("fatherProfession")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherCni" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">N° CNI / Passeport</Label>
                  <Input id="fatherCni" {...form.register("fatherCni")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherPhone" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Téléphone</Label>
                  <Input id="fatherPhone" {...form.register("fatherPhone")} className="h-9 text-xs rounded-md" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="fatherAddress" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Adresse & Domicile</Label>
                  <Input id="fatherAddress" {...form.register("fatherAddress")} className="h-9 text-xs rounded-md" />
                </div>
              </div>
            </div>

            {/* MARRIAGE SECTION */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                5. Mariage des parents / Legal Marriage
              </h3>
              <div className="flex items-center space-x-2 bg-neutral-50 p-4 rounded-md border border-neutral-100">
                <Checkbox
                  id="parentsMarried"
                  checked={form.watch("parentsMarried")}
                  onCheckedChange={(checked) => form.setValue("parentsMarried", checked === true)}
                  className="rounded-sm border-neutral-300"
                />
                <label
                  htmlFor="parentsMarried"
                  className="text-xs font-semibold text-neutral-700 cursor-pointer select-none"
                >
                  Les parents de l'enfant sont mariés légitimement
                </label>
              </div>

              {form.watch("parentsMarried") && (
                <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="marriageCertNumber" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">N° Acte de Mariage</Label>
                    <Input id="marriageCertNumber" {...form.register("marriageCertNumber")} className="h-9 text-xs rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="marriageDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Date du Mariage</Label>
                    <Input id="marriageDate" type="date" {...form.register("marriageDate")} className="h-9 text-xs rounded-md" />
                  </div>
                </div>
              )}
            </div>

            {/* FILE UPLOAD SECTION */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
                6. Formulaire FNU papier / Scanned FNU Sheet
              </h3>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">Fichier scanné du FNU papier officiel</Label>
                <FileUpload
                  value={uploadedFiles}
                  onValueChange={setUploadedFiles}
                  title="Glissez-déposez le formulaire FNU scanné"
                  description="Formats acceptés : PDF, PNG ou JPG (Max. 5 Mo)"
                  browseLabel="Parcourir"
                  maxFiles={1}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length === 0}
              className="w-full h-10 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-neutral-800 hover:bg-neutral-900 text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Enregistrement en cours..." : "Soumettre la déclaration FNU"}
            </Button>
          </form>
        </main>

        {/* Live Preview Panel */}
        <aside className="hidden xl:flex xl:w-1/2 flex-col min-w-0 bg-neutral-50 h-full overflow-y-auto p-6 items-center justify-start border-l border-neutral-200">
          <div className="w-full max-w-[500px] sticky top-0 space-y-4">
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
