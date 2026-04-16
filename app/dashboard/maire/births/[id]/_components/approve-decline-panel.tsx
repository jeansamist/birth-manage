"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { approveBirth, declineBirth } from "@/app/actions/birth"
import { declineSchema, type DeclineInput } from "@/lib/schemas/birth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function ApproveDeclinePanel({ birthId }: { birthId: string }) {
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeclineInput>({
    resolver: zodResolver(declineSchema),
  })

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
    <div className="space-y-4">
      <Separator />
      <h2 className="text-sm font-semibold">Décision</h2>

      {serverError && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {serverError}
        </p>
      )}

      {!showDeclineForm ? (
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={onApprove} disabled={isPending}>
            {isPending ? "Traitement…" : "Approuver et signer"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeclineForm(true)}
            disabled={isPending}
          >
            Refuser
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onDecline)} className="space-y-3">
          <div>
            <Label className="text-xs">
              Motif du refus <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("reason")}
              rows={4}
              placeholder="Précisez la raison du refus (min. 10 caractères)…"
              className="mt-1 text-sm resize-none"
            />
            {errors.reason && (
              <p className="text-xs text-destructive mt-1">{errors.reason.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
              {isPending ? "Envoi…" : "Confirmer le refus"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeclineForm(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
