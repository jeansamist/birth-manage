"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField } from "@/app/dashboard/hospital/births/new/_components/form-primitives"
import { AutocompleteInput } from "@/app/dashboard/hospital/births/new/_components/autocomplete-input"
import { PROFESSIONS } from "@/app/dashboard/hospital/births/new/_components/suggestions"

export function MotherFields({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue } = form
  const profession = watch("motherProfession") || ""

  return (
    <div className="rounded-2xl border border-border p-5 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        👩 Informations complémentaires — Mère
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="CNI / Passeport">
          <Input {...register("motherCni")} placeholder="123456789" />
        </FormField>
        <FormField label="Profession">
          <AutocompleteInput
            value={profession}
            onChangeValue={(val) => setValue("motherProfession", val)}
            suggestions={PROFESSIONS}
            placeholder="Profession de la mère"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Adresse">
          <Input {...register("motherAddress")} placeholder="Quartier, Ville" />
        </FormField>
        <FormField label="Téléphone">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-input bg-muted text-muted-foreground text-xs">
              +237
            </span>
            <Input
              type="tel"
              {...register("motherPhone")}
              placeholder="6XX XXX XXX"
              className="rounded-l-none"
            />
          </div>
        </FormField>
      </div>
    </div>
  )
}
