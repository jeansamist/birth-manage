"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MotherFieldsProps {
  form: UseFormReturn<any>
}

export function MotherFields({ form }: MotherFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
        3. La Mère / The Mother
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="motherLastName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Nom de famille de la Mère / Surname
          </Label>
          <Input id="motherLastName" {...form.register("motherLastName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherFirstName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Prénoms de la Mère / Given name
          </Label>
          <Input id="motherFirstName" {...form.register("motherFirstName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherBirthDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Date de naissance / Date of birth
          </Label>
          <Input id="motherBirthDate" type="date" {...form.register("motherBirthDate")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherNationality" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Nationalité / Nationality
          </Label>
          <Input id="motherNationality" {...form.register("motherNationality")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherCni" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            N° CNI / Passeport / Identity Ref
          </Label>
          <Input id="motherCni" {...form.register("motherCni")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherProfession" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Profession / Occupation
          </Label>
          <Input id="motherProfession" {...form.register("motherProfession")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherPhone" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Téléphone / Phone
          </Label>
          <Input id="motherPhone" {...form.register("motherPhone")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motherEmail" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Email
          </Label>
          <Input id="motherEmail" type="email" {...form.register("motherEmail")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="motherAddress" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Adresse & Domicile / Resident Address
          </Label>
          <Input id="motherAddress" {...form.register("motherAddress")} className="h-9 text-xs rounded-md" />
        </div>
      </div>
    </div>
  )
}
