"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { FormProgress } from "@/components/form/form-progress"
import type { SaveState } from "@/components/form/auto-save-indicator"
import { SidebarSaveFooter } from "./sidebar-save-footer"

interface LeftPanelProps {
  currentStep: number
  steps: { label: string; sublabel?: string; icon?: React.ReactNode }[]
  saveState: SaveState
  savedAt: Date | null
  onStepClick?: (stepIndex: number) => void
  onManualSave?: () => void
  isSavingManual?: boolean
}

export function LeftPanel({
  currentStep,
  steps,
  saveState,
  savedAt,
  onStepClick,
  onManualSave,
  isSavingManual = false,
}: LeftPanelProps) {
  return (
    <aside className="w-full md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/20 flex flex-col p-6 gap-6">
      {/* State / Official Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/hospital"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Retour au tableau de bord
        </Link>
        <div className="border-b pt-2 pb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">🇨🇲</span>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Régistre d'État Civil
            </span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Déclaration de Naissance
          </h1>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Portail Officiel d'Enregistrement Hospitalier
          </p>
        </div>
      </div>

      {/* Stepper vertical timeline */}
      <div className="flex-1">
        <p className="mb-4 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
          Progression de la saisie
        </p>
        <FormProgress
          steps={steps}
          currentStep={currentStep}
          onStepClick={onStepClick}
        />
      </div>

      <SidebarSaveFooter
        saveState={saveState}
        savedAt={savedAt}
        onManualSave={onManualSave}
        isSavingManual={isSavingManual}
      />
    </aside>
  )
}
