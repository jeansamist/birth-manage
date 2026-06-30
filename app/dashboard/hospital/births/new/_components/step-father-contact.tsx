"use client"

import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { FormField } from "./form-primitives"
import { AutocompleteInput } from "./autocomplete-input"
import { PROFESSIONS } from "./suggestions"

interface StepFatherContactProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepFatherContact({ form }: StepFatherContactProps) {
  const { register, watch, setValue } = form
  const profession = watch("fatherProfession") || ""

  return (
    <div className="space-y-4">
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
      <FormField label="Adresse de Domicile / Domicile Address">
        <Input {...register("fatherAddress")} placeholder="Quartier, ville" className="h-10" />
      </FormField>
      <FormField label="Téléphone / Phone">
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-muted text-neutral-600 text-xs">
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
  )
}
