"use client"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { ConfirmModal } from "@/components/form/confirm-modal"
import { useBirthForm } from "../_hooks/use-birth-form"
import { STEPS } from "./form-config"
import { LeftPanel } from "./left-panel"
import { FormHeader } from "./form-header"
import { StepContainer } from "./step-container"
import { DocumentPreview, type PreviewData } from "@/components/form/document-preview"

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

  const formValues = form.watch()

  const previewData: PreviewData = {
    babyFirstName: formValues.babyFirstName,
    babyLastName: formValues.babyLastName,
    babyGender: formValues.babyGender,
    birthDate: formValues.birthDate,
    birthTime: formValues.birthTime,
    birthPlace: formValues.birthPlace,
    weightGrams: formValues.weightGrams,
    heightCm: formValues.heightCm,
    apgarScore: formValues.apgarScore,
    deliveryType: formValues.deliveryType,
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
  }

  const goNext = async () => {
    if (await form.trigger(STEPS[step].fields as (keyof BirthFormInput)[])) {
      await triggerSave()
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[1700px] bg-card border border-border rounded-[24px] shadow-xl flex flex-col xl:flex-row min-h-[780px] overflow-hidden">
        <div className="flex flex-col md:flex-row flex-1 min-w-0">
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
          <main className="flex-1 flex flex-col min-w-0 bg-background xl:border-r border-border">
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

        {/* Panneau de droite : Rendu Pixel-Perfect du document réel */}
        <div className="hidden xl:block w-[460px] shrink-0 bg-muted/5 p-6 overflow-y-auto border-t xl:border-t-0 xl:border-l border-border select-none">
          <div className="sticky top-0">
            <p className="mb-4 text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
              Récépissé médical en temps réel
            </p>
            <div className="scale-[0.82] origin-top border shadow-md rounded-sm overflow-hidden bg-white">
              <DocumentPreview type="declaration" data={previewData} />
            </div>
          </div>
        </div>
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
