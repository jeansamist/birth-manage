"use client"

import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { FormField } from "./form-primitives"
import { AutocompleteInput } from "./autocomplete-input"
import { PROFESSIONS } from "./suggestions"

interface StepMotherContactProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepMotherContact({ form }: StepMotherContactProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const profession = watch("motherProfession") || ""

  return (
    <div className="rounded-md border border-border p-4 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
        Contact & Profession / Occupation
      </p>

      <FormField label="Profession / Occupation">
        <AutocompleteInput
          value={profession}
          onChangeValue={(val) => setValue("motherProfession", val)}
          suggestions={PROFESSIONS}
          placeholder="Enseignante"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Téléphone / Phone">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-muted text-neutral-600 text-xs">
              +237
            </span>
            <Input
              type="tel"
              {...register("motherPhone")}
              placeholder="6XX XXX XXX"
              className="h-10 rounded-l-none"
            />
          </div>
        </FormField>
        <FormField label="Email" error={errors.motherEmail?.message}>
          <Input
            type="email"
            {...register("motherEmail")}
            placeholder="amina@email.com"
            className="h-10"
          />
        </FormField>
      </div>

      <FormField label="Adresse de Domicile / Domicile Address">
        <Input
          {...register("motherAddress")}
          placeholder="Quartier, ville"
          className="h-10"
        />
      </FormField>
    </div>
  )
}
