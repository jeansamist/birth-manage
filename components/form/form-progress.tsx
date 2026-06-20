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
}

export function FormProgress({ steps, currentStep, className }: FormProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <ol className="flex items-start w-full">
        {steps.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          const upcoming = i > currentStep
          const isLast = i === steps.length - 1

          return (
            <li key={i} className={cn("flex items-start", !isLast && "flex-1")}>
              {/* Step dot + connector */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 text-xs font-semibold",
                    done && "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30",
                    active && "border-primary bg-background text-primary ring-4 ring-primary/15",
                    upcoming && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {done ? (
                    <CheckIcon className="size-4 stroke-[2.5]" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Label below dot */}
                <div className="mt-2 text-center px-1">
                  {step.icon && (
                    <div className={cn(
                      "mx-auto mb-1 text-base",
                      active ? "opacity-100" : "opacity-40"
                    )}>
                      {step.icon}
                    </div>
                  )}
                  <p
                    className={cn(
                      "text-[11px] font-medium leading-tight whitespace-nowrap transition-colors",
                      active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{step.sublabel}</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mt-4">
                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out rounded-full",
                        done ? "w-full bg-primary" : "w-0 bg-primary"
                      )}
                    />
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
