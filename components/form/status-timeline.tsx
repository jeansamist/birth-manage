"use client"

import { cn } from "@/lib/utils"
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

export type TimelineStepStatus = "done" | "active" | "pending" | "error"

export interface TimelineStep {
  label: string
  description?: string
  date?: string
  status: TimelineStepStatus
}

interface StatusTimelineProps {
  steps: TimelineStep[]
  className?: string
}

// ─── Icon & color maps ────────────────────────────────────────────────────────

const STATUS_ICON: Record<TimelineStepStatus, React.ReactNode> = {
  done: <CheckCircleIcon className="size-5 stroke-[1.5]" />,
  active: <ClockIcon className="size-5 stroke-[1.5]" />,
  pending: <CircleIcon className="size-5 stroke-[1.5]" />,
  error: <XCircleIcon className="size-5 stroke-[1.5]" />,
}

const STATUS_COLOR: Record<TimelineStepStatus, string> = {
  done: "text-emerald-600 dark:text-emerald-400",
  active: "text-amber-500 dark:text-amber-400",
  pending: "text-muted-foreground/40",
  error: "text-destructive",
}

const CONNECTOR_COLOR: Record<TimelineStepStatus, string> = {
  done: "bg-emerald-500",
  active: "bg-amber-400",
  pending: "bg-border",
  error: "bg-destructive/40",
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={i} className="flex gap-4">
            {/* Left: icon + connector */}
            <div className="flex flex-col items-center">
              <span className={cn("shrink-0 transition-colors", STATUS_COLOR[step.status])}>
                {STATUS_ICON[step.status]}
              </span>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-1 rounded-full min-h-6 transition-colors",
                    CONNECTOR_COLOR[step.status]
                  )}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={cn("pb-6 min-w-0", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium leading-tight",
                  step.status === "pending"
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              )}
              {step.date && (
                <p className="text-[11px] text-muted-foreground/70 mt-1 font-mono">
                  {step.date}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
