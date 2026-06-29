"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { RadioCardGroup } from "@/components/form/radio-card"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { StepBabyMedical } from "./step-baby-medical"

const GENDER_OPTIONS = [
  { value: "MALE" as const, label: "Masculin", icon: "👦" },
  { value: "FEMALE" as const, label: "Féminin", icon: "👧" },
]

interface StepBabyProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepBaby({ form }: StepBabyProps) {
  const { register, control, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <SectionTitle>👶 Informations sur l'enfant</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prénom" required error={errors.babyFirstName?.message}>
          <Input {...register("babyFirstName")} placeholder="Jean-Paul" className="h-10" />
        </FormField>
        <FormField label="Nom" required error={errors.babyLastName?.message}>
          <Input {...register("babyLastName")} placeholder="Mballa" className="h-10" />
        </FormField>
      </div>

      <FormField label="Sexe" required error={errors.babyGender?.message}>
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
        <FormField label="Date de naissance" required error={errors.birthDate?.message}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} placeholder="Date de naissance" />
            )}
          />
        </FormField>
        <FormField label="Heure de naissance">
          <Input type="time" {...register("birthTime")} className="h-10" />
        </FormField>
      </div>

      <FormField label="Lieu (salle / service)">
        <Input {...register("birthPlace")} placeholder="Ex: Salle B — Maternité" className="h-10" />
      </FormField>

      <StepBabyMedical form={form} />
    </div>
  )
}
