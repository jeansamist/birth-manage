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
      <SectionTitle>👨 Informations sur le père</SectionTitle>

      {/* Known / Unknown toggles */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer",
            !fatherUnknown ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          👨 Père connu
        </button>
        <button
          type="button"
          onClick={() => onToggle(true)}
          className={cn(
            "flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer",
            fatherUnknown ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          ❓ Père inconnu
        </button>
      </div>

      {fatherUnknown ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground"
        >
          Le père ne sera pas renseigné sur l'acte de naissance.
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-[10px] text-muted-foreground">Ces informations sont facultatives mais recommandées.</p>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Prénom">
              <Input {...register("fatherFirstName")} placeholder="Serge" className="h-10" />
            </FormField>
            <FormField label="Nom">
              <Input {...register("fatherLastName")} placeholder="Mballa" className="h-10" />
            </FormField>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">🪪 Identité & Documents</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date de naissance">
                <Controller
                  control={control}
                  name="fatherBirthDate"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} placeholder="Date de naissance" />
                  )}
                />
              </FormField>
              <FormField label="Nationalité">
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
