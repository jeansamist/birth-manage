"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FatherFieldsProps {
  form: UseFormReturn<any>
}

export function FatherFields({ form }: FatherFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1">
        Informations du Père / Father details
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fatherLastName" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Nom du Père / Surname
          </Label>
          <Input id="fatherLastName" {...form.register("fatherLastName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherFirstName" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Prénoms du Père / Given name
          </Label>
          <Input id="fatherFirstName" {...form.register("fatherFirstName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherBirthDate" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Date de naissance / Date of birth
          </Label>
          <Input id="fatherBirthDate" type="date" {...form.register("fatherBirthDate")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherNationality" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Nationalité / Nationality
          </Label>
          <Input id="fatherNationality" {...form.register("fatherNationality")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherProfession" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Profession / Occupation
          </Label>
          <Input id="fatherProfession" {...form.register("fatherProfession")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherCni" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            N° CNI / Passeport / Identity Ref
          </Label>
          <Input id="fatherCni" {...form.register("fatherCni")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fatherPhone" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Téléphone / Phone
          </Label>
          <Input id="fatherPhone" {...form.register("fatherPhone")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="fatherAddress" className="text-[9px] font-bold text-foreground uppercase tracking-wider">
            Adresse & Domicile / Resident Address
          </Label>
          <Input id="fatherAddress" {...form.register("fatherAddress")} className="h-9 text-xs rounded-md" />
        </div>
      </div>
    </div>
  )
}
