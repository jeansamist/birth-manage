"use client"

import * as React from "react"
import { CheckIcon, CloudIcon, Loader2Icon, WifiOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export type SaveState = "idle" | "saving" | "saved" | "error"

interface AutoSaveIndicatorProps {
  state: SaveState
  savedAt?: Date | null
  className?: string
}

const STATE_CONFIG = {
  idle: null,
  saving: {
    icon: <Loader2Icon className="size-3.5 animate-spin" />,
    label: "Sauvegarde…",
    className: "text-muted-foreground",
  },
  saved: {
    icon: <CheckIcon className="size-3.5 stroke-[2.5]" />,
    label: "Sauvegardé",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: <WifiOffIcon className="size-3.5" />,
    label: "Échec de sauvegarde",
    className: "text-destructive",
  },
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 5) return "à l'instant"
  if (secs < 60) return `il y a ${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `il y a ${mins}min`
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

export function AutoSaveIndicator({
  state,
  savedAt,
  className,
}: AutoSaveIndicatorProps) {
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0)

  // Refresh the "time ago" every 15s
  React.useEffect(() => {
    if (state !== "saved" || !savedAt) return
    const interval = setInterval(forceUpdate, 15_000)
    return () => clearInterval(interval)
  }, [state, savedAt])

  const config = STATE_CONFIG[state]

  if (!config) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          config.className,
          className
        )}
      >
        {config.icon}
        <span>
          {state === "saved" && savedAt
            ? `Sauvegardé ${timeAgo(savedAt)}`
            : config.label}
        </span>
        {state === "saved" && (
          <CloudIcon className="size-3.5 opacity-50" />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
