"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"

interface CityHallOption {
  id: string
  name: string
  city: string
}

interface StepReviewProps {
  form: UseFormReturn<BirthFormInput>
  cityHalls: CityHallOption[]
  serverError?: string | null
}

export function StepReview({ form, cityHalls, serverError }: StepReviewProps) {
  const { register, watch, setValue, control, formState: { errors } } = form
  const cityHallId = watch("cityHallId")
  const parentsMarried = watch("parentsMarried")

  return (
    <div className="space-y-6">
      {/* City hall selection */}
      <SectionTitle>🏛️ Mairie de destination</SectionTitle>

      <FormField
        label="Sélectionner une mairie"
        required
        error={errors.cityHallId?.message}
      >
        <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
          {cityHalls.map((c) => {
            const selected = cityHallId === c.id
            return (
              <label
                key={c.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <input
                  type="radio"
                  {...register("cityHallId")}
                  value={c.id}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border-2 transition-all shrink-0",
                    selected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selected && (
                    <CheckIcon className="size-3 text-primary-foreground stroke-[3]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.city}</p>
                </div>
              </label>
            )
          })}
        </div>
      </FormField>

      {/* Marriage status */}
      <SectionTitle>💍 Situation matrimoniale</SectionTitle>

      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setValue("parentsMarried", false)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            !parentsMarried
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          Non mariés
        </button>
        <button
          type="button"
          onClick={() => setValue("parentsMarried", true)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            parentsMarried
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          💍 Mariés
        </button>
      </div>

      <AnimatePresence>
        {parentsMarried && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormField label="N° acte de mariage">
                <Input
                  {...register("marriageCertNumber")}
                  placeholder="ACT-2023-001"
                  className="h-10"
                />
              </FormField>
              <FormField label="Date du mariage">
                <Controller
                  control={control}
                  name="marriageDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Date du mariage"
                    />
                  )}
                />
              </FormField>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server error */}
      {serverError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}
    </div>
  )
}
