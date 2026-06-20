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
  const cityHallId = watch("cityHallId")
  const parentsMarried = watch("parentsMarried")
  const values = form.getValues()

  return (
    <div className="space-y-6">
      <SectionTitle>🏛️ Mairie & Situation matrimoniale</SectionTitle>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* City Hall select */}
        <FormField label="Mairie de destination" required error={errors.cityHallId?.message}>
          <select
            {...register("cityHallId")}
            className="w-full h-11 px-4 border border-border rounded-xl bg-background text-sm cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sélectionner une mairie</option>
            {cityHalls.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </FormField>

        {/* Marriage Toggle status */}
        <FormField label="Parents mariés ?">
          <div className="flex rounded-xl border border-border overflow-hidden h-11">
            <button
              type="button"
              onClick={() => setValue("parentsMarried", false)}
              className={cn(
                "flex-1 text-xs font-medium transition-colors cursor-pointer",
                !parentsMarried ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              Non mariés
            </button>
            <button
              type="button"
              onClick={() => setValue("parentsMarried", true)}
              className={cn(
                "flex-1 text-xs font-medium transition-colors cursor-pointer",
                parentsMarried ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              💍 Mariés
            </button>
          </div>
        </FormField>
      </div>

      <AnimatePresence>
        {parentsMarried && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 border border-border rounded-xl p-4 bg-muted/5 overflow-hidden"
          >
            <FormField label="N° acte de mariage">
              <Input {...register("marriageCertNumber")} placeholder="ACT-2023-001" className="h-10" />
            </FormField>
            <FormField label="Date du mariage">
              <Controller
                control={control}
                name="marriageDate"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Date du mariage" />
                )}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewSummary values={values} fatherUnknown={fatherUnknown} onEditStep={onEditStep} />

      {serverError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          {serverError}
        </div>
      )}
    </div>
  )
}
