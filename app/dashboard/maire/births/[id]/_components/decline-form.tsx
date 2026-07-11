"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { declineSchema, type DeclineInput } from "@/lib/schemas/birth"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface DeclineFormProps {
  onSubmit: (data: DeclineInput) => void
  onCancel: () => void
  isPending: boolean
}

export function DeclineForm({ onSubmit, onCancel, isPending }: DeclineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeclineInput>({
    resolver: zodResolver(declineSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-muted/10 p-4 rounded-md border border-border">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Motif du refus / Reason for rejection <span className="text-destructive">*</span>
        </Label>
        <textarea
          {...register("reason")}
          rows={3}
          placeholder="Veuillez préciser la raison détaillée du refus (min. 10 caractères)…"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm focus:border-ring focus:ring-1 focus:ring-ring transition-all outline-none resize-none"
        />
        {errors.reason && (
          <p className="text-xs text-destructive mt-1 font-semibold">{errors.reason.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="destructive" className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer" disabled={isPending}>
          {isPending ? "Refus…" : "Confirmer le refus"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer"
          onClick={onCancel}
          disabled={isPending}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
