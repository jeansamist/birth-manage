"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, SendIcon, Loader2Icon } from "lucide-react"

interface FormHeaderProps {
  step: number
  totalSteps: number
  isPending: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  stepLabel: string
}

export function FormHeader({
  step,
  totalSteps,
  isPending,
  onPrev,
  onNext,
  onSubmit,
  stepLabel,
}: FormHeaderProps) {
  const isFirst = step === 0
  const isLast = step === totalSteps - 1

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-xs px-6 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          Étape {step + 1} sur {totalSteps}
        </span>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {stepLabel}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={isPending}
            className="h-8.5 rounded-lg text-xs font-medium cursor-pointer"
          >
            <ArrowLeftIcon className="size-3.5 mr-1" />
            Précédent
          </Button>
        )}

        {isLast ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="h-8.5 px-4 rounded-lg text-xs font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            {isPending ? <Loader2Icon className="size-3 animate-spin mr-1" /> : <SendIcon className="size-3 mr-1" />}
            Soumettre le dossier
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isPending}
            className="h-8.5 px-4 rounded-lg text-xs font-semibold cursor-pointer"
          >
            {isPending ? "Sauvegarde..." : "Continuer"}
            <ArrowRightIcon className="size-3.5 ml-1" />
          </Button>
        )}
      </div>
    </header>
  )
}
