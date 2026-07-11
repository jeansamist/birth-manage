"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface MarriageFieldsProps {
  form: UseFormReturn<any>
}

export function MarriageFields({ form }: MarriageFieldsProps) {
  const parentsMarried = form.watch("parentsMarried")

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1">
        Mariage des parents / Legal Marriage
      </h3>
      <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-md border border-border/50">
        <Checkbox
          id="parentsMarried"
          checked={parentsMarried}
          onCheckedChange={(checked) => form.setValue("parentsMarried", checked === true)}
          className="rounded-sm border-border"
        />
        <label
          htmlFor="parentsMarried"
          className="text-xs font-semibold text-foreground cursor-pointer select-none"
        >
          Les parents de l'enfant sont mariés légitimement / Parents are legally married
        </label>
      </div>

      {parentsMarried && (
        <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <Label htmlFor="marriageCertNumber" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
              N° Acte de Mariage / Marriage Cert No.
            </Label>
            <Input id="marriageCertNumber" {...form.register("marriageCertNumber")} className="h-9 text-xs rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="marriageDate" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
              Date du Mariage / Date of Marriage
            </Label>
            <Input id="marriageDate" type="date" {...form.register("marriageDate")} className="h-9 text-xs rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}
