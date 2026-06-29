"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface Step {
  label: string
  sublabel?: string
  icon?: React.ReactNode
}

interface FormProgressProps {
  steps: Step[]
  currentStep: number
  className?: string
  onStepClick?: (stepIndex: number) => void
}

export function FormProgress({ steps, currentStep, className, onStepClick }: FormProgressProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Timeline connector line */}
      <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-border pointer-events-none" />

      <ol className="flex flex-col gap-4 relative z-10 w-full">
        {steps.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          const upcoming = i > currentStep

          return (
            <li key={i} className="flex items-center w-full">
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                disabled={!onStepClick}
                className={cn(
                  "flex items-center gap-4 w-full p-2.5 rounded-xl transition-all text-left outline-none group",
                  onStepClick ? "cursor-pointer hover:bg-muted/40" : "pointer-events-none"
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "flex size-[28px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 text-xs font-semibold z-10 bg-background",
                    done && "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20",
                    active && "border-primary text-primary ring-4 ring-primary/15",
                    upcoming && "border-border text-muted-foreground group-hover:border-muted-foreground/60"
                  )}
                >
                  {done ? (
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Step Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {step.icon && (
                      <span className={cn("text-xs shrink-0", active ? "text-primary" : "text-muted-foreground")}>
                        {step.icon}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium tracking-tight transition-colors truncate",
                        active ? "text-primary font-semibold" : done ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.sublabel && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate pl-[18px]">
                      {step.sublabel}
                    </p>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
