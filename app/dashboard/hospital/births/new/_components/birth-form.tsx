"use client"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { ConfirmModal } from "@/components/form/confirm-modal"
import { useBirthForm } from "../_hooks/use-birth-form"
import { STEPS } from "./form-config"
import { LeftPanel } from "./left-panel"
import { FormHeader } from "./form-header"
import { StepContainer } from "./step-container"
export function BirthForm({
  cityHalls,
  initialData,
  id,
  defaultBirthPlace,
}: {
  cityHalls: { id: string; name: string; city: string }[]
  initialData?: Partial<BirthFormInput>
  id?: string
  defaultBirthPlace?: string
}) {
  const {
    step,
    setStep,
    direction,
    setDirection,
    saveState,
    savedAt,
    serverError,
    confirmOpen,
    setConfirmOpen,
    fatherUnknown,
    setFatherUnknown,
    isPending,
    form,
    triggerSave,
    handleFinalSubmit,
  } = useBirthForm(initialData, id, defaultBirthPlace)
  const goNext = async () => {
    if (await form.trigger(STEPS[step].fields as (keyof BirthFormInput)[])) {
      await triggerSave()
      setDirection(1)
      setStep((s) => s + 1)
    }
  }
  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[1260px] bg-card border border-border rounded-[24px] shadow-xl flex flex-col md:flex-row min-h-[750px]">
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
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          <FormHeader
            step={step}
            totalSteps={STEPS.length}
            isPending={isPending}
            onPrev={() => {
              setDirection(-1)
              setStep((s) => s - 1)
            }}
            onNext={goNext}
            onSubmit={() => setConfirmOpen(true)}
            stepLabel={STEPS[step].label}
          />
          <StepContainer
            step={step}
            direction={direction}
            form={form}
            cityHalls={cityHalls}
            serverError={serverError}
            fatherUnknown={fatherUnknown}
            setFatherUnknown={setFatherUnknown}
            setStep={setStep}
            setDirection={setDirection}
          />
        </main>
      </div>
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
        title="Soumettre la déclaration ?"
        description="Vous allez soumettre cet acte de naissance à la mairie. Cette action est définitive."
        confirmLabel="Confirmer et soumettre"
      />
    </div>
  )
}
