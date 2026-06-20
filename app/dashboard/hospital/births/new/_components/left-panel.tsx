"use client"

import Link from "next/link"
import { ArrowLeftIcon, SaveIcon, CheckCircle2Icon, AlertCircleIcon, Loader2Icon } from "lucide-react"
import { FormProgress } from "@/components/form/form-progress"
import type { SaveState } from "@/components/form/auto-save-indicator"
import { Button } from "@/components/ui/button"

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
  const formattedTime = savedAt
    ? savedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null

  return (
    <aside className="lg:w-[320px] xl:w-[350px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-muted/20 flex flex-col p-6 gap-6">
      {/* State / Official Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/hospital"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          Retour au tableau de bord
        </Link>
        <div className="pt-2 border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🇨🇲</span>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Régistre d'État Civil
            </span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Déclaration de Naissance
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Portail Officiel d'Enregistrement Hospitalier
          </p>
        </div>
      </div>

      {/* Stepper vertical timeline */}
      <div className="flex-1">
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Progression de la saisie
        </p>
        <FormProgress steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
      </div>

      {/* State / Save actions at the bottom */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-medium">Sauvegarde automatique</span>
          {saveState === "saving" && (
            <span className="inline-flex items-center gap-1 text-[10px] text-primary">
              <Loader2Icon className="size-3 animate-spin" /> Enregistrement...
            </span>
          )}
          {saveState === "saved" && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
              <CheckCircle2Icon className="size-3" /> Synchrone ({formattedTime})
            </span>
          )}
          {saveState === "error" && (
            <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
              <AlertCircleIcon className="size-3" /> Erreur de connexion
            </span>
          )}
          {saveState === "idle" && (
            <span className="text-[10px] text-muted-foreground">Prêt</span>
          )}
        </div>

        <Button
          type="button"
          onClick={onManualSave}
          disabled={isSavingManual || saveState === "saving"}
          className="w-full h-9 rounded-xl text-xs font-semibold gap-2 border bg-background text-foreground hover:bg-muted cursor-pointer"
        >
          <SaveIcon className="size-3.5" />
          {isSavingManual ? "Sauvegarde..." : "Enregistrer le brouillon"}
        </Button>
      </div>
    </aside>
  )
}
