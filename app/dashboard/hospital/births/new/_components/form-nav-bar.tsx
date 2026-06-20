"use client"

import { ArrowLeftIcon, ArrowRightIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormNavBarProps {
  step: number
  totalSteps: number
  isPending: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export function FormNavBar({
  step,
  totalSteps,
  isPending,
  onPrev,
  onNext,
  onSubmit,
}: FormNavBarProps) {
  const isFirst = step === 0
  const isLast = step === totalSteps - 1

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4 sm:px-8 shrink-0">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isFirst || isPending}
          className="gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          Précédent
        </Button>

        <span className="text-xs text-muted-foreground">
          Étape{" "}
          <span className="font-semibold text-foreground">{step + 1}</span>
          {" "}/ {totalSteps}
        </span>

        {isLast ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <SendIcon className="size-4" />
            {isPending ? "Envoi en cours…" : "Soumettre à la mairie"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? "Sauvegarde…" : "Suivant"}
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
