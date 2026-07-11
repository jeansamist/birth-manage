"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField } from "@/app/dashboard/hospital/births/new/_components/form-primitives"
import { AutocompleteInput } from "@/app/dashboard/hospital/births/new/_components/autocomplete-input"
import { PROFESSIONS } from "@/app/dashboard/hospital/births/new/_components/suggestions"

export function FatherFields({ form }: { form: UseFormReturn<any> }) {
  const { register, watch, setValue } = form
  const profession = watch("fatherProfession") || ""

  return (
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Informations complémentaires — Père / Father's details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prénom / First Name">
          <Input {...register("fatherFirstName")} placeholder="Serge" className="h-10" />
        </FormField>
        <FormField label="Nom de famille / Family Name">
          <Input {...register("fatherLastName")} placeholder="Mballa" className="h-10" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="N° CNI ou Passeport / NIC No. or passport">
          <Input {...register("fatherCni")} placeholder="987654321" className="h-10" />
        </FormField>
        <FormField label="Profession / Occupation">
          <AutocompleteInput
            value={profession}
            onChangeValue={(val) => setValue("fatherProfession", val)}
            suggestions={PROFESSIONS}
            placeholder="Ingénieur"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Adresse de Domicile / Domicile Address">
          <Input {...register("fatherAddress")} placeholder="Quartier, Ville" className="h-10" />
        </FormField>
        <FormField label="Téléphone / Phone">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-xs">
              +237
            </span>
            <Input
              type="tel"
              {...register("fatherPhone")}
              placeholder="6XX XXX XXX"
              className="h-10 rounded-l-none"
            />
          </div>
        </FormField>
      </div>
    </div>
  )
}
