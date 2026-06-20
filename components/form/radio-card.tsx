"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface RadioCardOption<T extends string> {
  value: T
  label: string
  description?: string
  icon?: React.ReactNode
}

interface RadioCardGroupProps<T extends string> {
  name: string
  options: RadioCardOption<T>[]
  value?: T
  onChange?: (value: T) => void
  className?: string
  disabled?: boolean
  columns?: 2 | 3 | 4
}

function RadioCardGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  className,
  disabled,
  columns = 2,
}: RadioCardGroupProps<T>) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns]

  return (
    <div className={cn("grid gap-3", colClass, className)}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <label
            key={option.value}
            className={cn(
              "relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-all duration-200 select-none",
              "hover:bg-muted/50",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange?.(option.value)}
              disabled={disabled}
              className="sr-only"
            />

            {/* Checkmark */}
            <span
              className={cn(
                "absolute top-3 right-3 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}
            >
              {selected && <CheckIcon className="size-3 stroke-[3]" />}
            </span>

            {/* Icon */}
            {option.icon && (
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-lg transition-colors",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.icon}
              </span>
            )}

            {/* Label */}
            <span
              className={cn(
                "text-sm font-medium leading-tight",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {option.label}
            </span>

            {/* Description */}
            {option.description && (
              <span className="text-xs text-muted-foreground leading-snug">
                {option.description}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}

export { RadioCardGroup }
export type { RadioCardOption, RadioCardGroupProps }
