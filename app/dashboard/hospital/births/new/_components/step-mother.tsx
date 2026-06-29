"use client"

import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { Controller } from "react-hook-form"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { StepMotherContact } from "./step-mother-contact"
import { AutocompleteInput } from "./autocomplete-input"
import { NATIONALITIES } from "./suggestions"

interface StepMotherProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepMother({ form }: StepMotherProps) {
  const { register, control, watch, setValue, formState: { errors } } = form
  const nationality = watch("motherNationality") || ""

  return (
    <div className="space-y-6">
      <SectionTitle>👩 Informations sur la mère</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prénom" required error={errors.motherFirstName?.message}>
          <Input {...register("motherFirstName")} placeholder="Amina" className="h-10" />
        </FormField>
        <FormField label="Nom" required error={errors.motherLastName?.message}>
          <Input {...register("motherLastName")} placeholder="Mballa" className="h-10" />
        </FormField>
      </div>

      {/* Identity block */}
      <div className="rounded-xl border border-border p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          🪪 Identité & Documents
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date de naissance">
            <Controller
              control={control}
              name="motherBirthDate"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} placeholder="Date de naissance" />
              )}
            />
          </FormField>
          <FormField label="Nationalité">
            <AutocompleteInput
              value={nationality}
              onChangeValue={(val) => setValue("motherNationality", val)}
              suggestions={NATIONALITIES}
              placeholder="Camerounaise"
            />
          </FormField>
        </div>
        <FormField label="CNI / Passeport">
          <Input {...register("motherCni")} placeholder="123456789" className="h-10" />
        </FormField>
      </div>

      <StepMotherContact form={form} />
    </div>
  )
}
