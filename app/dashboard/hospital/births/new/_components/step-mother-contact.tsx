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
    <div className="rounded-xl border border-border p-4 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        💼 Contact & Profession
      </p>

      <FormField label="Profession">
        <AutocompleteInput
          value={profession}
          onChangeValue={(val) => setValue("motherProfession", val)}
          suggestions={PROFESSIONS}
          placeholder="Enseignante"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Téléphone">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
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

      <FormField label="Adresse">
        <Input
          {...register("motherAddress")}
          placeholder="Quartier, ville"
          className="h-10"
        />
      </FormField>
    </div>
  )
}
