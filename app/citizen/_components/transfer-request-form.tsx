"use client"

import { ArrowRightLeftIcon } from "lucide-react"
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

export function TransferRequestForm({
  accessId,
  action,
  cityHalls,
  unavailableTargetIds,
}: TransferRequestFormProps) {
  return (
    <Card className="rounded-2xl border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <ArrowRightLeftIcon className="size-5 text-primary" /> Demander un transfert de copie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="accessId" value={accessId} />
          
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

          <div className="space-y-1.5">
            <Label htmlFor="requesterCni" className="text-xs font-semibold text-muted-foreground uppercase">
              Numéro de CNI du demandeur <span className="text-destructive">*</span>
            </Label>
            <Input
              id="requesterCni"
              name="requesterCni"
              placeholder="Ex. 1234567890"
              required
              className="h-12 text-base rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="idCardRecto" className="text-xs font-semibold text-muted-foreground uppercase">
                Photo CNI (Recto) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="idCardRecto"
                name="idCardRecto"
                type="file"
                accept="image/*"
                required
                className="h-12 text-base rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="idCardVerso" className="text-xs font-semibold text-muted-foreground uppercase">
                Photo CNI (Verso) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="idCardVerso"
                name="idCardVerso"
                type="file"
                accept="image/*"
                required
                className="h-12 text-base rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-semibold text-muted-foreground uppercase">
              Motif du transfert
            </Label>
            <textarea
              id="reason"
              name="reason"
              rows={2}
              placeholder="Ex. Rapprochement de mon lieu de résidence actuel..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase">
              Message pour le Maire
            </Label>
            <textarea
              id="message"
              name="message"
              rows={2}
              placeholder="Ex. Monsieur le Maire, veuillez agréer..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold cursor-pointer">
            Envoyer la demande de transfert
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
