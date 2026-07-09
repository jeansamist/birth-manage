"use client"

import { ArrowRightLeftIcon, IdCardIcon, Loader2Icon, MailIcon } from "lucide-react"
import { useState, useTransition, type FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

interface TransferRequestFormProps {
  accessId: string
  action: (formData: FormData) => void
  cityHalls: Array<{ id: string; name: string; city: string }>
  unavailableTargetIds: Set<string>
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function TransferRequestForm({
  accessId,
  action,
  cityHalls,
  unavailableTargetIds,
}: TransferRequestFormProps) {
  const [isPending, startTransition] = useTransition()
  const [fileError, setFileError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFileError(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const idCardRecto = formData.get("idCardRecto")
    const idCardVerso = formData.get("idCardVerso")

    try {
      if (idCardRecto instanceof File && idCardRecto.size > 0) {
        formData.set("idCardRecto", await fileToDataUrl(idCardRecto))
      }
      if (idCardVerso instanceof File && idCardVerso.size > 0) {
        formData.set("idCardVerso", await fileToDataUrl(idCardVerso))
      }
    } catch {
      setFileError("Impossible de lire les photos de la pièce d'identité. Veuillez réessayer.")
      return
    }

    startTransition(() => {
      action(formData)
    })
  }

  return (
    <Card className="rounded-3xl border border-border overflow-hidden shadow-sm">
      <CardHeader className="gap-3 border-b border-border/60 bg-muted/20 pb-5">
        <CardTitle className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ArrowRightLeftIcon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Demander un transfert de copie</p>
            <p className="text-xs font-normal text-muted-foreground">
              Transmis au maire de la mairie de destination pour examen
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="accessId" value={accessId} />

          {/* Section: Requester identity */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <IdCardIcon className="size-3.5" /> Identité du demandeur
            </legend>

            <div className="space-y-1.5">
              <Label htmlFor="requesterName" className="text-xs font-semibold text-muted-foreground uppercase">
                Nom complet du demandeur <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requesterName"
                name="requesterName"
                placeholder="Ex. Amina Mballa"
                required
                className="h-12 text-base rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="requesterCni" className="text-xs font-semibold text-muted-foreground uppercase">
                  N° de pièce d&apos;identité (CNI) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="requesterCni"
                  name="requesterCni"
                  placeholder="Ex. 1234567890"
                  required
                  className="h-12 text-base rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="requesterPhone" className="text-xs font-semibold text-muted-foreground uppercase">
                  Téléphone de contact
                </Label>
                <Input
                  id="requesterPhone"
                  name="requesterPhone"
                  placeholder="Ex. 699 99 99 99"
                  className="h-12 text-base rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="idCardRecto" className="text-xs font-semibold text-muted-foreground uppercase">
                  Photo pièce d&apos;identité (Recto) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="idCardRecto"
                  name="idCardRecto"
                  type="file"
                  accept="image/*"
                  required
                  className="h-12 rounded-xl file:h-full file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-semibold file:text-primary cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="idCardVerso" className="text-xs font-semibold text-muted-foreground uppercase">
                  Photo pièce d&apos;identité (Verso) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="idCardVerso"
                  name="idCardVerso"
                  type="file"
                  accept="image/*"
                  required
                  className="h-12 rounded-xl file:h-full file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-semibold file:text-primary cursor-pointer"
                />
              </div>
            </div>
            {fileError && (
              <p className="text-xs font-semibold text-destructive">{fileError}</p>
            )}
          </fieldset>

          {/* Section: Transfer details */}
          <fieldset className="space-y-4 border-t border-border/60 pt-5">
            <legend className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <ArrowRightLeftIcon className="size-3.5" /> Détails de la demande
            </legend>

            <div className="space-y-1.5">
              <Label htmlFor="targetCityHallId" className="text-xs font-semibold text-muted-foreground uppercase">
                Mairie de destination <span className="text-destructive">*</span>
              </Label>
              <NativeSelect
                id="targetCityHallId"
                name="targetCityHallId"
                className="w-full h-12 rounded-xl text-base"
                required
              >
                <NativeSelectOption value="">Sélectionner une mairie</NativeSelectOption>
                {cityHalls.map((cityHall) => (
                  <NativeSelectOption
                    key={cityHall.id}
                    value={cityHall.id}
                    disabled={unavailableTargetIds.has(cityHall.id)}
                  >
                    {cityHall.name} · {cityHall.city}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs font-semibold text-muted-foreground uppercase">
                Motif du transfert <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="reason"
                name="reason"
                rows={2}
                required
                placeholder="Ex. Rapprochement de mon lieu de résidence actuel..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                <MailIcon className="size-3.5" /> Message à l&apos;attention du Maire
              </Label>
              <textarea
                id="message"
                name="message"
                rows={2}
                placeholder="Ex. Monsieur le Maire, veuillez agréer..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl text-base font-semibold cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" /> Envoi en cours...
              </>
            ) : (
              "Envoyer la demande de transfert"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
