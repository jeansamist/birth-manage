"use client"

import { useState } from "react"
import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioCardGroup } from "@/components/form/radio-card"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormField } from "./form-primitives"

interface StepBabyMedicalProps {
  form: UseFormReturn<BirthFormInput>
}

const DELIVERY_OPTIONS = [
  { value: "NATURAL" as const, label: "Naturel / Natural", description: "Accouchement par voie basse" },
  { value: "CAESAREAN" as const, label: "Césarienne / Caesarean", description: "Intervention chirurgicale" },
]

export function StepBabyMedical({ form }: StepBabyMedicalProps) {
  const { register, control, watch, setValue } = form
  const [medicalExpanded, setMedicalExpanded] = useState(false)
  const weightGrams = watch("weightGrams")
  const heightCm = watch("heightCm")
  const weight = Number(weightGrams || 3200)
  const height = Number(heightCm || 50)

  return (
    <div className="rounded-md border border-border overflow-hidden bg-muted/5">
      <button
        type="button"
        onClick={() => setMedicalExpanded(!medicalExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Données médicales / Medical details (Facultatif)</span>
        <ChevronDownIcon className={cn("size-4 text-muted-foreground transition-transform", medicalExpanded && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {medicalExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 border-t border-border">
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Poids / Weight (g)">
                  <Input type="number" {...register("weightGrams")} placeholder="3200" className="h-10" />
                  <div className="flex gap-1 mt-1">
                    <button type="button" onClick={() => setValue("weightGrams", Math.max(0, weight - 100))} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer">-100g</button>
                    <button type="button" onClick={() => setValue("weightGrams", Math.max(0, weight + 100))} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer">+100g</button>
                  </div>
                </FormField>

                <FormField label="Taille / Height (cm)">
                  <Input type="number" step="0.1" {...register("heightCm")} placeholder="50" className="h-10" />
                  <div className="flex gap-1 mt-1">
                    <button type="button" onClick={() => setValue("heightCm", Math.max(0, height - 1))} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer">-1</button>
                    <button type="button" onClick={() => setValue("heightCm", Math.max(0, height + 1))} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer">+1</button>
                  </div>
                </FormField>

                <FormField label="Score Apgar">
                  <Input type="number" min="0" max="10" {...register("apgarScore")} placeholder="9" className="h-10" />
                  <div className="flex gap-1 mt-1">
                    <button type="button" onClick={() => setValue("apgarScore", 9)} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer">9</button>
                    <button type="button" onClick={() => setValue("apgarScore", 10)} className="text-[9px] border border-border px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer font-bold">10</button>
                  </div>
                </FormField>
              </div>

              <FormField label="Type d'accouchement / Delivery Type">
                <Controller
                  control={control}
                  name="deliveryType"
                  render={({ field }) => (
                    <RadioCardGroup
                      name="deliveryType"
                      options={DELIVERY_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormField>

              <FormField label="Notes médicales / Medical Notes">
                <Textarea {...register("medicalNotes")} rows={2} placeholder="Observations, complications..." className="resize-none text-xs rounded-md" />
              </FormField>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
