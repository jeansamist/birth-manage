"use client"

import { AnimatePresence, motion } from "framer-motion"
import { SendIcon } from "lucide-react"

import type { BirthFormInput } from "@/lib/schemas/birth"
import { submitBirthToCityHall } from "@/app/actions/birth"
import { ConfirmModal } from "@/components/form/confirm-modal"
import { useBirthForm } from "../_hooks/use-birth-form"
import { STEPS, slideVariants } from "./form-config"

import { LeftPanel } from "./left-panel"
import { FormHeader } from "./form-header"
import { StepBaby } from "./step-baby"
import { StepMother } from "./step-mother"
import { StepFather } from "./step-father"
import { StepReview } from "./step-review"

interface CityHallOption {
  id: string
  name: string
  city: string
}

export function BirthForm({
  cityHalls,
  initialData,
  id,
  defaultBirthPlace,
}: {
  cityHalls: CityHallOption[]
  initialData?: Partial<BirthFormInput>
  id?: string
  defaultBirthPlace?: string
}) {
  const {
    step,
    setStep,
    direction,
    setDirection,
    savedId,
    saveState,
    setSaveState,
    savedAt,
    serverError,
    setServerError,
    confirmOpen,
    setConfirmOpen,
    fatherUnknown,
    setFatherUnknown,
    isPending,
    startTransition,
    form,
    triggerSave,
  } = useBirthForm(initialData, id, defaultBirthPlace)

  const goNext = async () => {
    if (await form.trigger(STEPS[step].fields as (keyof BirthFormInput)[])) {
      await triggerSave()
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const handleFinalSubmit = () => {
    setConfirmOpen(false)
    setServerError(null)
    setSaveState("saving")
    startTransition(async () => {
      const result = await submitBirthToCityHall(form.getValues(), savedId)
      if (result && !result.success) {
        setServerError(result.error ?? "Une erreur est survenue.")
        setSaveState("error")
      }
    })
  }

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[1260px] bg-card border border-border rounded-[24px] shadow-xl flex flex-col md:flex-row min-h-[750px]">
        {/* Center aligned sidebar panel */}
        <LeftPanel
          currentStep={step}
          steps={STEPS}
          saveState={saveState}
          savedAt={savedAt}
          onStepClick={async (sIdx) => {
            if (sIdx > step) {
              if (!(await form.trigger(STEPS[step].fields as (keyof BirthFormInput)[]))) return
              await triggerSave()
            }
            setDirection(sIdx > step ? 1 : -1)
            setStep(sIdx)
          }}
          onManualSave={triggerSave}
        />

        {/* Unified center form panel */}
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          <FormHeader
            step={step}
            totalSteps={STEPS.length}
            isPending={isPending}
            onPrev={() => { setDirection(-1); setStep((s) => s - 1) }}
            onNext={goNext}
            onSubmit={() => setConfirmOpen(true)}
            stepLabel={STEPS[step].label}
          />

          <div className="flex-1 p-8 md:p-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeInOut" }}
              >
                {step === 0 && <StepBaby form={form} />}
                {step === 1 && <StepMother form={form} />}
                {step === 2 && (
                  <StepFather form={form} fatherUnknown={fatherUnknown} onToggle={(val) => {
                    setFatherUnknown(val)
                    if (val) { setDirection(1); setStep(3) }
                  }} />
                )}
                {step === 3 && (
                  <StepReview
                    form={form}
                    cityHalls={cityHalls}
                    serverError={serverError}
                    fatherUnknown={fatherUnknown}
                    onEditStep={(s) => { setDirection(-1); setStep(s) }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
        title="Soumettre la déclaration ?"
        description="Vous allez soumettre cet acte de naissance à la mairie. Cette action est définitive."
        confirmLabel="Confirmer et soumettre"
        cancelLabel="Annuler"
        icon={<SendIcon className="size-6 text-primary" />}
        isPending={isPending}
      />
    </div>
  )
}
