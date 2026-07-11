"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, SendIcon, Loader2Icon } from "lucide-react"
import { AutoSaveIndicator, type SaveState } from "@/components/form/auto-save-indicator"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FormHeaderProps {
  step: number
  totalSteps: number
  isPending: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  stepLabel: string
  saveState: SaveState
  savedAt: Date | null
  steps: { label: string }[]
  onStepClick: (idx: number) => void
}

export function FormHeader({
  step,
  totalSteps,
  isPending,
  onPrev,
  onNext,
  onSubmit,
  stepLabel,
  saveState,
  savedAt,
  steps,
  onStepClick,
}: FormHeaderProps) {
  const isLast = step === totalSteps - 1

  return (
    <div className="flex flex-col shrink-0 bg-background border-b border-border">
      {/* Barre de navigation supérieure */}
      <header className="px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/hospital"
            className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-muted/50"
          >
            <ArrowLeftIcon className="size-3.5 mr-1" />
            Retour
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                Régistre d'État Civil · Étape {step + 1}/{totalSteps}
              </span>
              <AutoSaveIndicator state={saveState} savedAt={savedAt} />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
              {stepLabel}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={isPending}
              className="h-8.5 rounded-md text-xs font-medium cursor-pointer"
            >
              Précédent
            </Button>
          )}

          {isLast ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="h-8.5 px-4 rounded-md text-xs font-semibold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm uppercase tracking-wider"
            >
              {isPending ? <Loader2Icon className="size-3 animate-spin mr-1" /> : <SendIcon className="size-3 mr-1" />}
              Soumettre
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              disabled={isPending}
              className="h-8.5 px-4 rounded-md text-xs font-semibold cursor-pointer uppercase tracking-wider"
            >
              {isPending ? "Sauvegarde..." : "Continuer"}
              <ArrowRightIcon className="size-3.5 ml-1" />
            </Button>
          )}
        </div>
      </header>

      {/* Indicateur de progression horizontal minimaliste */}
      <div className="flex border-t border-border bg-muted/50 text-[9px] font-semibold text-muted-foreground select-none">
        {steps.map((s, idx) => {
          const isActive = idx === step
          const isPassed = idx < step
          return (
            <button
              key={idx}
              type="button"
              disabled={idx > step && isPending}
              onClick={() => onStepClick(idx)}
              className={cn(
                "flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer uppercase tracking-wider",
                isActive
                  ? "border-primary text-foreground font-bold"
                  : isPassed
                  ? "border-muted-foreground text-muted-foreground"
                  : "border-transparent text-muted-foreground hover:text-muted-foreground"
              )}
            >
              {idx + 1}. {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
