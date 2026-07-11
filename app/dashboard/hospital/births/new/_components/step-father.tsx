"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { StepFatherContact } from "./step-father-contact"
import { AutocompleteInput } from "./autocomplete-input"
import { NATIONALITIES } from "./suggestions"

interface StepFatherProps {
  form: UseFormReturn<BirthFormInput>
  fatherUnknown: boolean
  onToggle: (unknown: boolean) => void
}

export function StepFather({ form, fatherUnknown, onToggle }: StepFatherProps) {
  const { register, control, watch, setValue } = form
  const nationality = watch("fatherNationality") || ""

  return (
    <div className="space-y-6">
      <SectionTitle>Renseignements sur le père</SectionTitle>

      <div className="flex rounded-md border border-border overflow-hidden">
        {([false, true] as const).map((isUnknown) => (
          <button
            key={String(isUnknown)}
            type="button"
            onClick={() => onToggle(isUnknown)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
              fatherUnknown === isUnknown ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            )}
          >
            {isUnknown ? "Père inconnu / Father Unknown" : "Père connu / Father Known"}
          </button>
        ))}
      </div>

      {fatherUnknown ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground"
        >
          Le père ne sera pas renseigné sur la déclaration de naissance.
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-[10px] text-muted-foreground">Ces informations sont facultatives mais recommandées.</p>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nom de famille / Family Name">
              <Input {...register("fatherLastName")} placeholder="Mballa" className="h-10" />
            </FormField>
            <FormField label="Prénom / First Name">
              <Input {...register("fatherFirstName")} placeholder="Serge" className="h-10" />
            </FormField>
          </div>

          <div className="rounded-md border border-border p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Identité & Documents / Identity Details</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date de naissance / Date of Birth">
                <Controller
                  control={control}
                  name="fatherBirthDate"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
              <FormField label="Nationalité / Nationality">
                <AutocompleteInput
                  value={nationality}
                  onChangeValue={(val) => setValue("fatherNationality", val)}
                  suggestions={NATIONALITIES}
                  placeholder="Camerounais"
                />
              </FormField>
            </div>
            <StepFatherContact form={form} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
