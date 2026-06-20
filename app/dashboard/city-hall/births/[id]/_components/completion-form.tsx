"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { completeBirthRecord, submitToMaire } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MotherFields } from "./mother-fields"
import { FatherFields } from "./father-fields"
import { MarriageFields } from "./marriage-fields"

interface CompletionData {
  motherCni: string
  motherProfession: string
  motherAddress: string
  motherPhone: string
  fatherFirstName: string
  fatherLastName: string
  fatherCni: string
  fatherProfession: string
  fatherAddress: string
  fatherPhone: string
  parentsMarried: boolean
  marriageCertNumber: string
  marriageDate: string
}

export function CompletionForm({ birth }: { birth: any }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CompletionData>({
    defaultValues: {
      motherCni: birth.motherCni ?? "",
      motherProfession: birth.motherProfession ?? "",
      motherAddress: birth.motherAddress ?? "",
      motherPhone: birth.motherPhone ?? "",
      fatherFirstName: birth.fatherFirstName ?? "",
      fatherLastName: birth.fatherLastName ?? "",
      fatherCni: birth.fatherCni ?? "",
      fatherProfession: birth.fatherProfession ?? "",
      fatherAddress: birth.fatherAddress ?? "",
      fatherPhone: birth.fatherPhone ?? "",
      parentsMarried: birth.parentsMarried ?? false,
      marriageCertNumber: birth.marriageCertNumber ?? "",
      marriageDate: birth.marriageDate ? new Date(birth.marriageDate).toISOString().split("T")[0] : "",
    },
  })

  const { handleSubmit } = form

  const onSave = (data: CompletionData) => {
    setServerError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await completeBirthRecord(birth.id, data as any)
      if (!result.success) {
        setServerError(result.error ?? "Erreur lors de la sauvegarde.")
      } else {
        setSaved(true)
      }
    })
  }

  const onSubmitToMaire = () => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitToMaire(birth.id)
      if (result && !result.success) {
        setServerError(result.error ?? "Erreur lors de la soumission.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <MotherFields form={form as any} />
      <FatherFields form={form as any} />
      <MarriageFields form={form as any} />

      {serverError && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-4 py-2.5">{serverError}</p>
      )}
      {saved && (
        <p className="text-xs text-green-600 bg-green-50 rounded-xl px-4 py-2.5 font-medium">Dossier sauvegardé.</p>
      )}

      <Separator />

      <div className="flex items-center gap-3">
        <Button type="submit" variant="outline" className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer" disabled={isPending}>
          {isPending ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
        <Button type="button" className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer" disabled={isPending} onClick={onSubmitToMaire}>
          {isPending ? "Envoi..." : "Soumettre au Maire"}
        </Button>
      </div>
    </form>
  )
}
