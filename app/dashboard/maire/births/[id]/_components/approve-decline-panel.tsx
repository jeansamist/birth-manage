"use client"

import { useState, useTransition } from "react"
import { approveBirth, declineBirth } from "@/app/actions/birth"
import type { DeclineInput } from "@/lib/schemas/birth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DeclineForm } from "./decline-form"

export function ApproveDeclinePanel({ birthId }: { birthId: string }) {
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onApprove() {
    setServerError(null)
    startTransition(async () => {
      const result = await approveBirth(birthId)
      if (result && !result.success) {
        setServerError(result.error ?? "Erreur lors de l'approbation.")
      }
    })
  }

  function onDecline(data: DeclineInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await declineBirth(birthId, data.reason)
      if (result && !result.success) {
        setServerError(result.error ?? "Erreur lors du refus.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Separator />
      
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Décision de signature</h2>

        {serverError && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-4 py-2.5 font-semibold">
            {serverError}
          </p>
        )}

        {!showDeclineForm ? (
          <div className="flex items-center gap-3">
            <Button
              className="h-12 px-6 rounded-xl text-base font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all cursor-pointer"
              onClick={onApprove}
              disabled={isPending}
            >
              {isPending ? "Traitement…" : "✍️ Approuver et signer"}
            </Button>
            <Button
              className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer"
              variant="destructive"
              onClick={() => setShowDeclineForm(true)}
              disabled={isPending}
            >
              Refuser le dossier
            </Button>
          </div>
        ) : (
          <DeclineForm
            onSubmit={onDecline}
            onCancel={() => setShowDeclineForm(false)}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  )
}
