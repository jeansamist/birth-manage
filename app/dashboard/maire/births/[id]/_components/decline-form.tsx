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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Motif du refus <span className="text-destructive">*</span>
        </Label>
        <textarea
          {...register("reason")}
          rows={4}
          placeholder="Veuillez préciser la raison détaillée du refus (min. 10 caractères)…"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
        />
        {errors.reason && (
          <p className="text-xs text-destructive mt-1 font-semibold">{errors.reason.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="destructive" className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer" disabled={isPending}>
          {isPending ? "Envoi…" : "Confirmer le refus"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer"
          onClick={onCancel}
          disabled={isPending}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
