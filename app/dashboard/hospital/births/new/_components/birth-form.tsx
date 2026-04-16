"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import {
  birthFormSchema,
  babyStepSchema,
  motherStepSchema,
  fatherStepSchema,
  reviewStepSchema,
  babyStepFields,
  motherStepFields,
  fatherStepFields,
  reviewStepFields,
  type BirthFormInput,
} from "@/lib/schemas/birth"
import { saveBirthDraft, submitBirthToCityHall } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CityHallOption {
  id: string
  name: string
  city: string
}

const STEPS = [
  { label: "Enfant & Médical", schema: babyStepSchema, fields: babyStepFields },
  { label: "Mère", schema: motherStepSchema, fields: motherStepFields },
  { label: "Père", schema: fatherStepSchema, fields: fatherStepFields },
  { label: "Révision & Mairie", schema: reviewStepSchema, fields: reviewStepFields },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

export function BirthForm({ cityHalls }: { cityHalls: CityHallOption[] }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [savedId, setSavedId] = useState<string | undefined>()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<BirthFormInput>({
    resolver: zodResolver(birthFormSchema),
    mode: "onBlur",
    defaultValues: {
      parentsMarried: false,
      babyGender: undefined,
      deliveryType: undefined,
    },
  })

  const { register, handleSubmit, trigger, watch, formState: { errors } } = form

  async function goNext() {
    const fields = STEPS[step].fields as (keyof BirthFormInput)[]
    const valid = await trigger(fields)
    if (!valid) return

    // Auto-save draft on step advance
    startTransition(async () => {
      const data = form.getValues()
      const result = await saveBirthDraft(data, savedId)
      if (result.success && result.id) setSavedId(result.id)
    })

    setDirection(1)
    setStep((s) => s + 1)
  }

  function goPrev() {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  async function onSubmit(data: BirthFormInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await submitBirthToCityHall(data, savedId)
      if (result && !result.success) {
        setServerError(result.error ?? "Une erreur est survenue.")
      }
      // On success, server action redirects to /dashboard/hospital
    })
  }

  const parentsMarried = watch("parentsMarried")

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-0 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "size-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                  i < step
                    ? "bg-primary border-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary bg-background"
                      : "border-muted-foreground/30 text-muted-foreground/50 bg-background",
                )}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] whitespace-nowrap",
                  i === step ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 mb-4 transition-colors",
                  i < step ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {/* Step 0: Baby + Medical */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold">Informations sur l'enfant</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Prénom <span className="text-destructive">*</span></Label>
                        <Input {...register("babyFirstName")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.babyFirstName?.message} />
                      </div>
                      <div>
                        <Label className="text-xs">Nom <span className="text-destructive">*</span></Label>
                        <Input {...register("babyLastName")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.babyLastName?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Sexe <span className="text-destructive">*</span></Label>
                        <select
                          {...register("babyGender")}
                          className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="">Sélectionner</option>
                          <option value="MALE">Masculin</option>
                          <option value="FEMALE">Féminin</option>
                        </select>
                        <FieldError message={errors.babyGender?.message} />
                      </div>
                      <div>
                        <Label className="text-xs">Date de naissance <span className="text-destructive">*</span></Label>
                        <Input type="date" {...register("birthDate")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.birthDate?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Heure de naissance</Label>
                        <Input type="time" {...register("birthTime")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Lieu (salle / service)</Label>
                        <Input {...register("birthPlace")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>

                    <Separator />
                    <h2 className="text-sm font-semibold">Données médicales</h2>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Poids (g)</Label>
                        <Input type="number" {...register("weightGrams")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Taille (cm)</Label>
                        <Input type="number" step="0.1" {...register("heightCm")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Score Apgar</Label>
                        <Input type="number" min="0" max="10" {...register("apgarScore")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Type d'accouchement</Label>
                      <select
                        {...register("deliveryType")}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="">Sélectionner</option>
                        <option value="NATURAL">Naturel</option>
                        <option value="CAESAREAN">Césarienne</option>
                        <option value="FORCEPS">Forceps</option>
                        <option value="VACUUM">Ventouse</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Notes médicales</Label>
                      <Textarea {...register("medicalNotes")} rows={3} className="mt-1 text-sm resize-none" />
                    </div>
                  </div>
                )}

                {/* Step 1: Mother */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold">Informations sur la mère</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Prénom <span className="text-destructive">*</span></Label>
                        <Input {...register("motherFirstName")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.motherFirstName?.message} />
                      </div>
                      <div>
                        <Label className="text-xs">Nom <span className="text-destructive">*</span></Label>
                        <Input {...register("motherLastName")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.motherLastName?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Date de naissance</Label>
                        <Input type="date" {...register("motherBirthDate")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Nationalité</Label>
                        <Input {...register("motherNationality")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">CNI / Passeport</Label>
                        <Input {...register("motherCni")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Profession</Label>
                        <Input {...register("motherProfession")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Adresse</Label>
                      <Input {...register("motherAddress")} className="mt-1 h-8 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Téléphone</Label>
                        <Input type="tel" {...register("motherPhone")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input type="email" {...register("motherEmail")} className="mt-1 h-8 text-sm" />
                        <FieldError message={errors.motherEmail?.message} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Father */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold">Informations sur le père</h2>
                    <p className="text-xs text-muted-foreground">Ces informations sont facultatives.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Prénom</Label>
                        <Input {...register("fatherFirstName")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Nom</Label>
                        <Input {...register("fatherLastName")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Date de naissance</Label>
                        <Input type="date" {...register("fatherBirthDate")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Nationalité</Label>
                        <Input {...register("fatherNationality")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">CNI / Passeport</Label>
                        <Input {...register("fatherCni")} className="mt-1 h-8 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Profession</Label>
                        <Input {...register("fatherProfession")} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Adresse</Label>
                      <Input {...register("fatherAddress")} className="mt-1 h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Téléphone</Label>
                      <Input type="tel" {...register("fatherPhone")} className="mt-1 h-8 text-sm" />
                    </div>
                  </div>
                )}

                {/* Step 3: Review + City hall */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold">Mairie de destination</h2>
                    <div>
                      <Label className="text-xs">Mairie <span className="text-destructive">*</span></Label>
                      <select
                        {...register("cityHallId")}
                        className="mt-1 flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="">Sélectionner une mairie</option>
                        {cityHalls.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.city}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.cityHallId?.message} />
                    </div>

                    <Separator />
                    <h2 className="text-sm font-semibold">Situation matrimoniale</h2>

                    <div className="flex items-center gap-2">
                      <input
                        id="parentsMarried"
                        type="checkbox"
                        {...register("parentsMarried")}
                        className="size-4 rounded border-input accent-primary"
                      />
                      <Label htmlFor="parentsMarried" className="text-xs cursor-pointer">
                        Les parents sont mariés
                      </Label>
                    </div>

                    {parentsMarried && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">N° acte de mariage</Label>
                          <Input {...register("marriageCertNumber")} className="mt-1 h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs">Date du mariage</Label>
                          <Input type="date" {...register("marriageDate")} className="mt-1 h-8 text-sm" />
                        </div>
                      </div>
                    )}

                    {serverError && (
                      <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                        {serverError}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={step === 0 || isPending}
              >
                Précédent
              </Button>
              <span className="text-xs text-muted-foreground">
                Étape {step + 1} / {STEPS.length}
              </span>
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={goNext}
                  disabled={isPending}
                >
                  {isPending ? "Sauvegarde…" : "Suivant"}
                </Button>
              ) : (
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? "Envoi…" : "Soumettre à la mairie"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
