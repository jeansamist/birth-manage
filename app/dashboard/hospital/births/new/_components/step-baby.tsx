"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { RadioCardGroup } from "@/components/form/radio-card"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { StepBabyMedical } from "./step-baby-medical"

const GENDER_OPTIONS = [
  { value: "MALE" as const, label: "Masculin / Male" },
  { value: "FEMALE" as const, label: "Féminin / Female" },
]

interface StepBabyProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepBaby({ form }: StepBabyProps) {
  const { register, control, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <SectionTitle>Renseignements sur l'enfant</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nom de famille / Family Name" required error={errors.babyLastName?.message}>
          <Input {...register("babyLastName")} placeholder="Mballa" className="h-10" />
        </FormField>
        <FormField label="Prénom / First Name" required error={errors.babyFirstName?.message}>
          <Input {...register("babyFirstName")} placeholder="Jean-Paul" className="h-10" />
        </FormField>
      </div>

      <FormField label="Sexe / Gender" required error={errors.babyGender?.message}>
        <Controller
          control={control}
          name="babyGender"
          render={({ field }) => (
            <RadioCardGroup
              name="babyGender"
              options={GENDER_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Date de naissance / Date of Birth" required error={errors.birthDate?.message}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
        <FormField label="Heure de naissance / Time of Birth">
          <Input type="time" {...register("birthTime")} className="h-10" />
        </FormField>
      </div>

      <FormField label="Lieu de naissance / Place of Birth (salle / service)">
        <Input {...register("birthPlace")} placeholder="Ex: Maternité - Salle de travail A" className="h-10" />
      </FormField>

      <StepBabyMedical form={form} />
    </div>
  )
}
