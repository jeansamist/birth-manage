"use client"

import { useState, useTransition } from "react"
import { approveBirth, declineBirth } from "@/app/actions/birth"
import type { DeclineInput } from "@/lib/schemas/birth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DeclineForm } from "./decline-form"
import { SignaturePadDialog } from "./signature-pad-dialog"

export function ApproveDeclinePanel({
  birthId,
  savedSignature,
}: {
  birthId: string
  savedSignature: string | null
}) {
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [showSignatureDialog, setShowSignatureDialog] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onApprove(signatureDataUrl: string | null) {
    setServerError(null)
    startTransition(async () => {
      const result = await approveBirth(birthId, signatureDataUrl ?? undefined)
      if (result && !result.success) {
        setShowSignatureDialog(false)
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
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Décision de signature / Signature Decision</h3>

        {serverError && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-md px-4 py-2.5 font-semibold">
            {serverError}
          </p>
        )}

        {!showDeclineForm ? (
          <div className="flex items-center gap-3">
            <Button
              className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer"
              onClick={() => setShowSignatureDialog(true)}
              disabled={isPending}
            >
              {isPending ? "Signature…" : "Approuver et signer"}
            </Button>
            <Button
              className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer"
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

      <SignaturePadDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        savedSignature={savedSignature}
        isPending={isPending}
        onConfirm={onApprove}
      />
    </div>
  )
}
