"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { FormProgress } from "@/components/form/form-progress"
import { LiveSummary } from "@/components/form/live-summary"
import { AutoSaveIndicator, type SaveState } from "@/components/form/auto-save-indicator"
import type { BirthFormInput } from "@/lib/schemas/birth"

interface CityHallOption {
  id: string
  name: string
  city: string
}

interface LeftPanelProps {
  currentStep: number
  steps: { label: string; sublabel?: string; icon?: React.ReactNode }[]
  watch: BirthFormInput
  fatherUnknown: boolean
  cityHalls: CityHallOption[]
  saveState: SaveState
  savedAt: Date | null
}

export function LeftPanel({
  currentStep,
  steps,
  watch: w,
  fatherUnknown,
  cityHalls,
  saveState,
  savedAt,
}: LeftPanelProps) {
  const selectedCityHall = cityHalls.find((c) => c.id === w.cityHallId)

  return (
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
          Remplissez les informations en {steps.length} étapes.
        </p>
      </div>

      {/* Stepper */}
      <div className="p-6 border-b border-border">
        <FormProgress steps={steps} currentStep={currentStep} />
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
          currentStep={currentStep}
        />
      </div>

      {/* Auto-save */}
      <div className="p-4 border-t border-border">
        <AutoSaveIndicator state={saveState} savedAt={savedAt} />
      </div>
    </aside>
  )
}
