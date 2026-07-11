"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { ReviewSummary } from "./review-summary"

interface CityHallOption {
  id: string
  name: string
  city: string
}

interface StepReviewProps {
  form: UseFormReturn<BirthFormInput>
  cityHalls: CityHallOption[]
  serverError?: string | null
  fatherUnknown: boolean
  onEditStep: (stepIndex: number) => void
}

export function StepReview({ form, cityHalls, serverError, fatherUnknown, onEditStep }: StepReviewProps) {
  const { register, watch, setValue, control, formState: { errors } } = form
  const parentsMarried = watch("parentsMarried")
  const values = form.getValues()

  return (
    <div className="space-y-6">
      <SectionTitle>Mairie & Situation matrimoniale</SectionTitle>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Mairie de destination / City Hall" required error={errors.cityHallId?.message}>
          <select
            {...register("cityHallId")}
            className="w-full h-10 px-3 border border-border rounded-md bg-card text-sm text-foreground cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Sélectionner une mairie</option>
            {cityHalls.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Parents mariés ? / Parents Married ?">
          <div className="flex rounded-md border border-border overflow-hidden h-10">
            {([false, true] as const).map((isMarried) => (
              <button
                key={String(isMarried)}
                type="button"
                onClick={() => setValue("parentsMarried", isMarried)}
                className={cn(
                  "flex-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                  parentsMarried === isMarried ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                )}
              >
                {isMarried ? "Oui / Yes" : "Non / No"}
              </button>
            ))}
          </div>
        </FormField>
      </div>

      <AnimatePresence>
        {parentsMarried && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 border border-border rounded-md p-4 bg-muted/5 overflow-hidden"
          >
            <FormField label="N° acte de mariage / Marriage certificate No.">
              <Input {...register("marriageCertNumber")} placeholder="ACT-2023-001" className="h-10" />
            </FormField>
            <FormField label="Date du mariage / Marriage Date">
              <Controller
                control={control}
                name="marriageDate"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewSummary values={values} fatherUnknown={fatherUnknown} onEditStep={onEditStep} />

      {serverError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          {serverError}
        </div>
      )}
    </div>
  )
}
