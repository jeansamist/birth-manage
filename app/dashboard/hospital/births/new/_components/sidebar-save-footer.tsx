"use client"

import {
  SaveIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SaveState } from "@/components/form/auto-save-indicator"

interface SidebarSaveFooterProps {
  saveState: SaveState
  savedAt: Date | null
  onManualSave?: () => void
  isSavingManual?: boolean
}

export function SidebarSaveFooter({
  saveState,
  savedAt,
  onManualSave,
  isSavingManual = false,
}: SidebarSaveFooterProps) {
  const formattedTime = savedAt
    ? savedAt.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground">Sauvegarde automatique</span>
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
        {saveState === "idle" && <span className="text-[10px] text-muted-foreground">Prêt</span>}
      </div>

      <Button
        type="button"
        onClick={onManualSave}
        disabled={isSavingManual || saveState === "saving"}
        className="h-9 w-full cursor-pointer gap-2 rounded-xl border bg-background text-xs font-semibold text-foreground hover:bg-muted"
      >
        <SaveIcon className="size-3.5" />
        {isSavingManual ? "Sauvegarde..." : "Enregistrer le brouillon"}
      </Button>
    </div>
  )
}
