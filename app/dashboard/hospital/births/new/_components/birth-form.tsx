"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
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

// UI primitives
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// New UX components
import { FormProgress } from "@/components/form/form-progress"
import { RadioCardGroup } from "@/components/form/radio-card"
import { LiveSummary } from "@/components/form/live-summary"
import {
  AutoSaveIndicator,
  type SaveState,
} from "@/components/form/auto-save-indicator"
import { ConfirmModal } from "@/components/form/confirm-modal"

import { cn } from "@/lib/utils"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SendIcon,
  ChevronDownIcon,
  LandmarkIcon,
  Baby,
  UserIcon,
  UsersIcon,
  CheckIcon,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface CityHallOption {
  id: string
  name: string
  city: string
}

interface BirthFormProps {
  cityHalls: CityHallOption[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: "Enfant",
    sublabel: "& Médical",
    icon: <Baby className="size-3.5" />,
    schema: babyStepSchema,
    fields: babyStepFields,
  },
  {
    label: "Mère",
    icon: <UserIcon className="size-3.5" />,
    schema: motherStepSchema,
    fields: motherStepFields,
  },
  {
    label: "Père",
    icon: <UsersIcon className="size-3.5" />,
    schema: fatherStepSchema,
    fields: fatherStepFields,
  },
  {
    label: "Révision",
    sublabel: "& Mairie",
    icon: <LandmarkIcon className="size-3.5" />,
    schema: reviewStepSchema,
    fields: reviewStepFields,
  },
]

const GENDER_OPTIONS = [
  { value: "MALE" as const, label: "Masculin", icon: "👦" },
  { value: "FEMALE" as const, label: "Féminin", icon: "👧" },
]

const DELIVERY_OPTIONS = [
  { value: "NATURAL" as const, label: "Naturel", description: "Accouchement par voie basse" },
  { value: "CAESAREAN" as const, label: "Césarienne", description: "Intervention chirurgicale" },
  { value: "FORCEPS" as const, label: "Forceps", description: "Assistance instrumentale" },
  { value: "VACUUM" as const, label: "Ventouse", description: "Extraction par ventouse" },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

// ─── Field helpers ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-destructive mt-1.5 flex items-center gap-1"
    >
      <span className="size-3 rounded-full bg-destructive/20 flex items-center justify-center text-[9px]">!</span>
      {message}
    </motion.p>
  )
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-2">
      <h2 className="text-sm font-semibold text-foreground">{children}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function BirthForm({ cityHalls }: BirthFormProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [savedId, setSavedId] = useState<string | undefined>()
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fatherUnknown, setFatherUnknown] = useState(false)
  const [medicalExpanded, setMedicalExpanded] = useState(true)
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

  const { register, handleSubmit, trigger, watch, control, formState: { errors } } = form

  // Watch values for LiveSummary
  const w = watch()

  // ── Navigation ────────────────────────────────────────────────────────────

  async function goNext() {
    const fields = STEPS[step].fields as (keyof BirthFormInput)[]
    const valid = await trigger(fields)
    if (!valid) return

    // Auto-save draft
    setSaveState("saving")
    startTransition(async () => {
      const data = form.getValues()
      const result = await saveBirthDraft(data, savedId)
      if (result.success && result.id) {
        setSavedId(result.id)
        setSaveState("saved")
        setSavedAt(new Date())
      } else {
        setSaveState("error")
      }
    })

    setDirection(1)
    setStep((s) => s + 1)
  }

  function goPrev() {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  function skipFather() {
    setFatherUnknown(true)
    setDirection(1)
    setStep((s) => s + 1)
  }

  async function handleFinalSubmit() {
    setConfirmOpen(false)
    setServerError(null)
    setSaveState("saving")
    startTransition(async () => {
      const data = form.getValues()
      const result = await submitBirthToCityHall(data, savedId)
      if (result && !result.success) {
        setServerError(result.error ?? "Une erreur est survenue.")
        setSaveState("error")
      }
      // On success → server redirects
    })
  }

  const parentsMarried = watch("parentsMarried")
  const selectedCityHall = cityHalls.find((c) => c.id === w.cityHallId)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <aside className="lg:w-[340px] xl:w-[380px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Link
            href="/dashboard/hospital"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeftIcon className="size-3.5" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-base font-semibold">Nouvelle naissance</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Remplissez les informations en {STEPS.length} étapes.
          </p>
        </div>

        {/* Stepper */}
        <div className="p-6 border-b border-border">
          <FormProgress steps={STEPS} currentStep={step} />
        </div>

        {/* Live summary */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Résumé en direct
          </p>
          <LiveSummary
            baby={{
              firstName: w.babyFirstName,
              lastName: w.babyLastName,
              gender: w.babyGender as "MALE" | "FEMALE" | undefined,
              birthDate: w.birthDate,
              weightGrams: w.weightGrams as number | undefined,
            }}
            mother={{
              firstName: w.motherFirstName,
              lastName: w.motherLastName,
              nationality: w.motherNationality,
              profession: w.motherProfession,
            }}
            father={
              fatherUnknown
                ? undefined
                : {
                    firstName: w.fatherFirstName,
                    lastName: w.fatherLastName,
                    nationality: w.fatherNationality,
                  }
            }
            cityHallName={selectedCityHall?.name}
            currentStep={step}
          />
        </div>

        {/* Auto-save indicator */}
        <div className="p-4 border-t border-border">
          <AutoSaveIndicator state={saveState} savedAt={savedAt} />
        </div>
      </aside>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 sm:p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <form onSubmit={handleSubmit(() => setConfirmOpen(true))}>

                  {/* ── STEP 0 — Enfant & Médical ──────────────────────────── */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <SectionTitle>👶 Informations sur l'enfant</SectionTitle>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Prénom" required error={errors.babyFirstName?.message}>
                          <Input
                            {...register("babyFirstName")}
                            placeholder="Jean-Paul"
                            className="h-10"
                          />
                        </FormField>
                        <FormField label="Nom" required error={errors.babyLastName?.message}>
                          <Input
                            {...register("babyLastName")}
                            placeholder="Mballa"
                            className="h-10"
                          />
                        </FormField>
                      </div>

                      <FormField label="Sexe" required error={errors.babyGender?.message}>
                        <Controller
                          control={control}
                          name="babyGender"
                          render={({ field }) => (
                            <RadioCardGroup
                              name="babyGender"
                              options={GENDER_OPTIONS}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </FormField>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Date de naissance"
                          required
                          error={errors.birthDate?.message}
                        >
                          <Input
                            type="date"
                            {...register("birthDate")}
                            className="h-10"
                          />
                        </FormField>
                        <FormField label="Heure de naissance">
                          <Input
                            type="time"
                            {...register("birthTime")}
                            className="h-10"
                          />
                        </FormField>
                      </div>

                      <FormField label="Lieu (salle / service)">
                        <Input
                          {...register("birthPlace")}
                          placeholder="Ex: Salle B — Maternité"
                          className="h-10"
                        />
                      </FormField>

                      {/* Medical section — collapsible */}
                      <div className="rounded-xl border border-border overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setMedicalExpanded(!medicalExpanded)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                        >
                          <span className="text-sm font-medium">🩺 Données médicales</span>
                          <ChevronDownIcon
                            className={cn(
                              "size-4 text-muted-foreground transition-transform duration-200",
                              medicalExpanded && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {medicalExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <FormField label="Poids (g)">
                                    <Input
                                      type="number"
                                      {...register("weightGrams")}
                                      placeholder="3200"
                                      className="h-10"
                                    />
                                  </FormField>
                                  <FormField label="Taille (cm)">
                                    <Input
                                      type="number"
                                      step="0.1"
                                      {...register("heightCm")}
                                      placeholder="50"
                                      className="h-10"
                                    />
                                  </FormField>
                                  <FormField label="Score Apgar">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="10"
                                      {...register("apgarScore")}
                                      placeholder="9"
                                      className="h-10"
                                    />
                                  </FormField>
                                </div>

                                <FormField label="Type d'accouchement">
                                  <Controller
                                    control={control}
                                    name="deliveryType"
                                    render={({ field }) => (
                                      <RadioCardGroup
                                        name="deliveryType"
                                        options={DELIVERY_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        columns={4}
                                      />
                                    )}
                                  />
                                </FormField>

                                <FormField label="Notes médicales">
                                  <Textarea
                                    {...register("medicalNotes")}
                                    rows={3}
                                    placeholder="Observations, complications éventuelles…"
                                    className="resize-none"
                                  />
                                </FormField>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 1 — Mère ──────────────────────────────────────── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <SectionTitle>👩 Informations sur la mère</SectionTitle>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Prénom"
                          required
                          error={errors.motherFirstName?.message}
                        >
                          <Input
                            {...register("motherFirstName")}
                            placeholder="Amina"
                            className="h-10"
                          />
                        </FormField>
                        <FormField
                          label="Nom"
                          required
                          error={errors.motherLastName?.message}
                        >
                          <Input
                            {...register("motherLastName")}
                            placeholder="Mballa"
                            className="h-10"
                          />
                        </FormField>
                      </div>

                      <div className="rounded-xl border border-border p-4 space-y-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          🪪 Identité & Documents
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Date de naissance">
                            <Input
                              type="date"
                              {...register("motherBirthDate")}
                              className="h-10"
                            />
                          </FormField>
                          <FormField label="Nationalité">
                            <Input
                              {...register("motherNationality")}
                              placeholder="Camerounaise"
                              className="h-10"
                            />
                          </FormField>
                        </div>
                        <FormField label="CNI / Passeport">
                          <Input
                            {...register("motherCni")}
                            placeholder="123456789"
                            className="h-10"
                          />
                        </FormField>
                      </div>

                      <div className="rounded-xl border border-border p-4 space-y-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          💼 Contact & Profession
                        </p>
                        <FormField label="Profession">
                          <Input
                            {...register("motherProfession")}
                            placeholder="Enseignante"
                            className="h-10"
                          />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Téléphone">
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
                                +237
                              </span>
                              <Input
                                type="tel"
                                {...register("motherPhone")}
                                placeholder="6XX XXX XXX"
                                className="h-10 rounded-l-none"
                              />
                            </div>
                          </FormField>
                          <FormField
                            label="Email"
                            error={errors.motherEmail?.message}
                          >
                            <Input
                              type="email"
                              {...register("motherEmail")}
                              placeholder="amina@email.com"
                              className="h-10"
                            />
                          </FormField>
                        </div>
                        <FormField label="Adresse">
                          <Input
                            {...register("motherAddress")}
                            placeholder="Quartier, ville"
                            className="h-10"
                          />
                        </FormField>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2 — Père ──────────────────────────────────────── */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <SectionTitle>👨 Informations sur le père</SectionTitle>

                      {/* Père connu / inconnu toggle */}
                      <div className="flex rounded-xl border border-border overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setFatherUnknown(false)}
                          className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            !fatherUnknown
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                          )}
                        >
                          👨 Père connu
                        </button>
                        <button
                          type="button"
                          onClick={skipFather}
                          className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            fatherUnknown
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                          )}
                        >
                          ❓ Père inconnu / non déclaré
                        </button>
                      </div>

                      {!fatherUnknown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <p className="text-xs text-muted-foreground">
                            Ces informations sont facultatives mais recommandées.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField label="Prénom">
                              <Input
                                {...register("fatherFirstName")}
                                placeholder="Serge"
                                className="h-10"
                              />
                            </FormField>
                            <FormField label="Nom">
                              <Input
                                {...register("fatherLastName")}
                                placeholder="Mballa"
                                className="h-10"
                              />
                            </FormField>
                          </div>

                          <div className="rounded-xl border border-border p-4 space-y-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              🪪 Identité & Documents
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="Date de naissance">
                                <Input
                                  type="date"
                                  {...register("fatherBirthDate")}
                                  className="h-10"
                                />
                              </FormField>
                              <FormField label="Nationalité">
                                <Input
                                  {...register("fatherNationality")}
                                  placeholder="Camerounais"
                                  className="h-10"
                                />
                              </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="CNI / Passeport">
                                <Input
                                  {...register("fatherCni")}
                                  placeholder="987654321"
                                  className="h-10"
                                />
                              </FormField>
                              <FormField label="Profession">
                                <Input
                                  {...register("fatherProfession")}
                                  placeholder="Ingénieur"
                                  className="h-10"
                                />
                              </FormField>
                            </div>
                            <FormField label="Adresse">
                              <Input
                                {...register("fatherAddress")}
                                placeholder="Quartier, ville"
                                className="h-10"
                              />
                            </FormField>
                            <FormField label="Téléphone">
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
                                  +237
                                </span>
                                <Input
                                  type="tel"
                                  {...register("fatherPhone")}
                                  placeholder="6XX XXX XXX"
                                  className="h-10 rounded-l-none"
                                />
                              </div>
                            </FormField>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 3 — Révision & Mairie ─────────────────────────── */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <SectionTitle>🏛️ Mairie de destination</SectionTitle>

                      <FormField
                        label="Sélectionner une mairie"
                        required
                        error={errors.cityHallId?.message}
                      >
                        <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
                          {cityHalls.map((c) => {
                            const selected = w.cityHallId === c.id
                            return (
                              <label
                                key={c.id}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all",
                                  selected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/40"
                                )}
                              >
                                <input
                                  type="radio"
                                  {...register("cityHallId")}
                                  value={c.id}
                                  className="sr-only"
                                />
                                <div
                                  className={cn(
                                    "flex size-5 items-center justify-center rounded-full border-2 transition-all shrink-0",
                                    selected
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/30"
                                  )}
                                >
                                  {selected && (
                                    <CheckIcon className="size-3 text-primary-foreground stroke-[3]" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{c.name}</p>
                                  <p className="text-xs text-muted-foreground">{c.city}</p>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </FormField>

                      <SectionTitle>💍 Situation matrimoniale</SectionTitle>

                      <div className="flex rounded-xl border border-border overflow-hidden">
                        <button
                          type="button"
                          onClick={() => form.setValue("parentsMarried", false)}
                          className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            !parentsMarried
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                          )}
                        >
                          Non mariés
                        </button>
                        <button
                          type="button"
                          onClick={() => form.setValue("parentsMarried", true)}
                          className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            parentsMarried
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                          )}
                        >
                          💍 Mariés
                        </button>
                      </div>

                      <AnimatePresence>
                        {parentsMarried && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <FormField label="N° acte de mariage">
                                <Input
                                  {...register("marriageCertNumber")}
                                  placeholder="ACT-2023-001"
                                  className="h-10"
                                />
                              </FormField>
                              <FormField label="Date du mariage">
                                <Input
                                  type="date"
                                  {...register("marriageDate")}
                                  className="h-10"
                                />
                              </FormField>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error display */}
                      {serverError && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                          {serverError}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom nav bar ────────────────────────────────────────────────── */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4 sm:px-8">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              disabled={step === 0 || isPending}
              className="gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              Précédent
            </Button>

            <span className="text-xs text-muted-foreground">
              Étape <span className="font-semibold text-foreground">{step + 1}</span> / {STEPS.length}
            </span>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? "Sauvegarde…" : "Suivant"}
                <ArrowRightIcon className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <SendIcon className="size-4" />
                {isPending ? "Envoi en cours…" : "Soumettre à la mairie"}
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* ── Confirmation modal ───────────────────────────────────────────────── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit(handleFinalSubmit)}
        title="Soumettre la déclaration ?"
        description={`Vous allez soumettre l'acte de naissance${w.babyFirstName ? ` de ${w.babyFirstName} ${w.babyLastName ?? ""}` : ""} à ${selectedCityHall?.name ?? "la mairie sélectionnée"}. Cette action est définitive.`}
        confirmLabel="Confirmer et soumettre"
        cancelLabel="Relire d'abord"
        icon={<SendIcon className="size-6 text-primary" />}
        isPending={isPending}
      />
    </div>
  )
}
