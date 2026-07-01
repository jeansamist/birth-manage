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
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
        5. Mariage des parents / Legal Marriage
      </h3>
      <div className="flex items-center space-x-2 bg-neutral-50 p-4 rounded-md border border-neutral-100">
        <Checkbox
          id="parentsMarried"
          checked={parentsMarried}
          onCheckedChange={(checked) => form.setValue("parentsMarried", checked === true)}
          className="rounded-sm border-neutral-300"
        />
        <label
          htmlFor="parentsMarried"
          className="text-xs font-semibold text-neutral-700 cursor-pointer select-none"
        >
          Les parents de l'enfant sont mariés légitimement / Parents are legally married
        </label>
      </div>

      {parentsMarried && (
        <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <Label htmlFor="marriageCertNumber" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
              N° Acte de Mariage / Marriage Cert No.
            </Label>
            <Input id="marriageCertNumber" {...form.register("marriageCertNumber")} className="h-9 text-xs rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="marriageDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
              Date du Mariage / Date of Marriage
            </Label>
            <Input id="marriageDate" type="date" {...form.register("marriageDate")} className="h-9 text-xs rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}
