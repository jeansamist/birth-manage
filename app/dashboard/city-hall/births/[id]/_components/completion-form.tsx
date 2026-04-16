"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { completeBirthRecord, submitToMaire } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompletionForm({ birth }: { birth: any }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, watch } = useForm<CompletionData>({
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
      marriageDate: birth.marriageDate
        ? new Date(birth.marriageDate).toISOString().split("T")[0]
        : "",
    },
  })

  const parentsMarried = watch("parentsMarried")

  function onSave(data: CompletionData) {
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

  function onSubmitToMaire() {
    setServerError(null)
    startTransition(async () => {
      const result = await submitToMaire(birth.id)
      if (result && !result.success) {
        setServerError(result.error ?? "Erreur lors de la soumission.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">Informations complémentaires — Mère</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">CNI / Passeport</Label>
              <Input {...register("motherCni")} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Profession</Label>
              <Input {...register("motherProfession")} className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Adresse</Label>
            <Input {...register("motherAddress")} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Téléphone</Label>
            <Input type="tel" {...register("motherPhone")} className="mt-1 h-8 text-sm" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">Informations complémentaires — Père</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Prénom</Label>
              <Input {...register("fatherFirstName")} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Nom</Label>
              <Input {...register("fatherLastName")} className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">CNI / Passeport</Label>
              <Input {...register("fatherCni")} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Profession</Label>
              <Input {...register("fatherProfession")} className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Adresse</Label>
            <Input {...register("fatherAddress")} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Téléphone</Label>
            <Input type="tel" {...register("fatherPhone")} className="mt-1 h-8 text-sm" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-medium">Situation matrimoniale</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="parentsMarried"
              type="checkbox"
              {...register("parentsMarried")}
              className="size-4 rounded border-input accent-primary"
            />
            <Label htmlFor="parentsMarried" className="text-xs cursor-pointer">
              Les parents sont mariés
            </Label>
          </div>
          {parentsMarried && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">N° acte de mariage</Label>
                <Input {...register("marriageCertNumber")} className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Date du mariage</Label>
                <Input type="date" {...register("marriageDate")} className="mt-1 h-8 text-sm" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {serverError && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{serverError}</p>
      )}
      {saved && (
        <p className="text-xs text-green-600 bg-green-50 rounded-md px-3 py-2">Dossier sauvegardé.</p>
      )}

      <Separator />

      <div className="flex items-center gap-3">
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          {isPending ? "…" : "Sauvegarder"}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={onSubmitToMaire}
        >
          {isPending ? "Envoi…" : "Soumettre au Maire"}
        </Button>
      </div>
    </form>
  )
}
