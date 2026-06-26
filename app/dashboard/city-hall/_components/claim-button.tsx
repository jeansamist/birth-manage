"use client"

import { useState, useTransition } from "react"
import { claimBirth } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"

export function ClaimButton({ birthId }: { birthId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-6 text-xs"
        disabled={isPending}
        onClick={() => {
          setError(null)
          startTransition(async () => {
            const result = await claimBirth(birthId)
            if (result && !result.success) {
              setError(result.error ?? "Impossible de prendre en charge ce dossier.")
            }
          })
        }}
      >
        {isPending ? "…" : "Prendre en charge"}
      </Button>
      {error ? <span className="text-[10px] text-destructive">{error}</span> : null}
    </div>
  )
}
