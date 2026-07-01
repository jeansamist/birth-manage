"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BabyFieldsProps {
  form: UseFormReturn<any>
}

export function BabyFields({ form }: BabyFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
        2. L'Enfant / The Child
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="babyLastName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Nom de famille / Surname
          </Label>
          <Input id="babyLastName" {...form.register("babyLastName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="babyFirstName" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Prénoms / Given Name
          </Label>
          <Input id="babyFirstName" {...form.register("babyFirstName")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="babyGender" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Sexe / Gender
          </Label>
          <Select
            value={form.watch("babyGender")}
            onValueChange={(val) => form.setValue("babyGender", val as "MALE" | "FEMALE")}
          >
            <SelectTrigger className="h-9 text-xs rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE" className="text-xs">Masculin / Male</SelectItem>
              <SelectItem value="FEMALE" className="text-xs">Féminin / Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthDate" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Date de naissance / Date of birth
          </Label>
          <Input id="birthDate" type="date" {...form.register("birthDate")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthTime" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Heure de naissance / Time of birth
          </Label>
          <Input id="birthTime" type="time" {...form.register("birthTime")} className="h-9 text-xs rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthPlace" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
            Lieu de naissance / Place of birth
          </Label>
          <Input id="birthPlace" {...form.register("birthPlace")} placeholder="Ex. Douala V" className="h-9 text-xs rounded-md" />
        </div>
      </div>
    </div>
  )
}
