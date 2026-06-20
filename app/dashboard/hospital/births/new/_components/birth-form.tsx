"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Baby, UserIcon, UsersIcon, LandmarkIcon, SendIcon } from "lucide-react"

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
import { ConfirmModal } from "@/components/form/confirm-modal"
import type { SaveState } from "@/components/form/auto-save-indicator"

import { LeftPanel } from "./left-panel"
import { FormNavBar } from "./form-nav-bar"
import { StepBaby } from "./step-baby"
import { StepMother } from "./step-mother"
import { StepFather } from "./step-father"
import { StepReview } from "./step-review"

// ─── Types ───────────────────────────────────────────────────────────────────

interface CityHallOption {
  id: string
  name: string
  city: string
}

// ─── Steps config ─────────────────────────────────────────────────────────────

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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BirthForm({ cityHalls }: { cityHalls: CityHallOption[] }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [savedId, setSavedId] = useState<string | undefined>()
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fatherUnknown, setFatherUnknown] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<BirthFormInput>({
    resolver: zodResolver(birthFormSchema),
    mode: "onBlur",
    defaultValues: { parentsMarried: false },
  })

  const w = form.watch()

  // ── Navigation ─────────────────────────────────────────────────────────────

  async function goNext() {
    const fields = STEPS[step].fields as (keyof BirthFormInput)[]
    const valid = await form.trigger(fields)
    if (!valid) return

    setSaveState("saving")
    startTransition(async () => {
      const result = await saveBirthDraft(form.getValues(), savedId)
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

  function handleFatherToggle(unknown: boolean) {
    setFatherUnknown(unknown)
    if (unknown) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  async function handleFinalSubmit() {
    setConfirmOpen(false)
    setServerError(null)
    setSaveState("saving")
    startTransition(async () => {
      const result = await submitBirthToCityHall(form.getValues(), savedId)
      if (result && !result.success) {
        setServerError(result.error ?? "Une erreur est survenue.")
        setSaveState("error")
      }
      // On success → server action redirects
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const selectedCityHall = cityHalls.find((c) => c.id === w.cityHallId)

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      {/* Left panel — stepper + live summary */}
      <LeftPanel
        currentStep={step}
        steps={STEPS}
        watch={w}
        fatherUnknown={fatherUnknown}
        cityHalls={cityHalls}
        saveState={saveState}
        savedAt={savedAt}
      />

      {/* Right panel — step content + nav bar */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
                {step === 0 && <StepBaby form={form} />}
                {step === 1 && <StepMother form={form} />}
                {step === 2 && (
                  <StepFather
                    form={form}
                    fatherUnknown={fatherUnknown}
                    onToggle={handleFatherToggle}
                  />
                )}
                {step === 3 && (
                  <StepReview
                    form={form}
                    cityHalls={cityHalls}
                    serverError={serverError}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <FormNavBar
          step={step}
          totalSteps={STEPS.length}
          isPending={isPending}
          onPrev={goPrev}
          onNext={goNext}
          onSubmit={() => setConfirmOpen(true)}
        />
      </main>

      {/* Confirmation modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
        title="Soumettre la déclaration ?"
        description={`Vous allez soumettre l'acte de naissance${
          w.babyFirstName
            ? ` de ${w.babyFirstName} ${w.babyLastName ?? ""}`
            : ""
        } à ${selectedCityHall?.name ?? "la mairie sélectionnée"}. Cette action est définitive.`}
        confirmLabel="Confirmer et soumettre"
        cancelLabel="Relire d'abord"
        icon={<SendIcon className="size-6 text-primary" />}
        isPending={isPending}
      />
    </div>
  )
}
