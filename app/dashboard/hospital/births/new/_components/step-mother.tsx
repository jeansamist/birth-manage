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
      <SectionTitle>Renseignements sur la mère</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nom de famille / Family Name" required error={errors.motherLastName?.message}>
          <Input {...register("motherLastName")} placeholder="Mballa" className="h-10" />
        </FormField>
        <FormField label="Prénom / First Name" required error={errors.motherFirstName?.message}>
          <Input {...register("motherFirstName")} placeholder="Amina" className="h-10" />
        </FormField>
      </div>

      {/* Identity block */}
      <div className="rounded-md border border-border p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Identité & Documents / Identity Details
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date de naissance / Date of Birth">
            <Controller
              control={control}
              name="motherBirthDate"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>
          <FormField label="Nationalité / Nationality">
            <AutocompleteInput
              value={nationality}
              onChangeValue={(val) => setValue("motherNationality", val)}
              suggestions={NATIONALITIES}
              placeholder="Camerounaise"
            />
          </FormField>
        </div>
        <FormField label="N° CNI ou Passeport / NIC No. or passport">
          <Input {...register("motherCni")} placeholder="123456789" className="h-10" />
        </FormField>
      </div>

      <StepMotherContact form={form} />
    </div>
  )
}
