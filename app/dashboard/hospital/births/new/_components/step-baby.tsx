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
import { FormField, SectionTitle, DatePicker } from "./form-primitives"

const GENDER_OPTIONS = [
  { value: "MALE" as const, label: "Masculin", icon: "👦" },
  { value: "FEMALE" as const, label: "Féminin", icon: "👧" },
]

const DELIVERY_OPTIONS = [
  {
    value: "NATURAL" as const,
    label: "Naturel",
    description: "Voie basse",
  },
  {
    value: "CAESAREAN" as const,
    label: "Césarienne",
    description: "Intervention chirurgicale",
  },
  {
    value: "FORCEPS" as const,
    label: "Forceps",
    description: "Assistance instrumentale",
  },
  {
    value: "VACUUM" as const,
    label: "Ventouse",
    description: "Extraction par ventouse",
  },
]

interface StepBabyProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepBaby({ form }: StepBabyProps) {
  const [medicalExpanded, setMedicalExpanded] = useState(true)
  const { register, control, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <SectionTitle>👶 Informations sur l'enfant</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prénom" required error={errors.babyFirstName?.message}>
          <Input
            {...register("babyFirstName")}
            placeholder="Jean-Paul"
            className="h-10"
          />
        </FormField>
        <FormField label="Nom" required error={errors.babyLastName?.message}>
          <Input
            {...register("babyLastName")}
            placeholder="Mballa"
            className="h-10"
          />
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
        <FormField
          label="Date de naissance"
          required
          error={errors.birthDate?.message}
        >
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Date de naissance"
              />
            )}
          />
        </FormField>
        <FormField label="Heure de naissance">
          <Input type="time" {...register("birthTime")} className="h-10" />
        </FormField>
      </div>

      <FormField label="Lieu (salle / service)">
        <Input
          {...register("birthPlace")}
          placeholder="Ex: Salle B — Maternité"
          className="h-10"
        />
      </FormField>

      {/* Collapsible medical data */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setMedicalExpanded(!medicalExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
        >
          <span className="text-sm font-medium">🩺 Données médicales</span>
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              medicalExpanded && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {medicalExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Poids (g)">
                    <div className="relative">
                      <Input
                        type="number"
                        {...register("weightGrams")}
                        placeholder="3200"
                        className="h-10"
                      />
                    </div>
                    {/* Quick Select & Increments */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const wVal = Number(form.watch("weightGrams") || 3200)
                          form.setValue("weightGrams", Math.max(0, wVal - 100))
                        }}
                        className="text-[10px] font-semibold border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        -100g
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const wVal = Number(form.watch("weightGrams") || 3200)
                          form.setValue("weightGrams", wVal + 100)
                        }}
                        className="text-[10px] font-semibold border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        +100g
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("weightGrams", 3000)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        3kg
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("weightGrams", 3500)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        3.5kg
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Taille (cm)">
                    <Input
                      type="number"
                      step="0.1"
                      {...register("heightCm")}
                      placeholder="50"
                      className="h-10"
                    />
                    {/* Quick Select & Increments */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const hVal = Number(form.watch("heightCm") || 50)
                          form.setValue("heightCm", Math.max(0, hVal - 1))
                        }}
                        className="text-[10px] font-semibold border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const hVal = Number(form.watch("heightCm") || 50)
                          form.setValue("heightCm", hVal + 1)
                        }}
                        className="text-[10px] font-semibold border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("heightCm", 50)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        50
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Score Apgar">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      {...register("apgarScore")}
                      placeholder="9"
                      className="h-10"
                    />
                    {/* Quick Select & Increments */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => form.setValue("apgarScore", 8)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        8
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("apgarScore", 9)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        9
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("apgarScore", 10)}
                        className="text-[10px] border px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer font-semibold"
                      >
                        10
                      </button>
                    </div>
                  </FormField>
                </div>

                <FormField label="Type d'accouchement">
                  <Controller
                    control={control}
                    name="deliveryType"
                    render={({ field }) => (
                      <RadioCardGroup
                        name="deliveryType"
                        options={DELIVERY_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        columns={4}
                      />
                    )}
                  />
                </FormField>

                <FormField label="Notes médicales">
                  <Textarea
                    {...register("medicalNotes")}
                    rows={3}
                    placeholder="Observations, complications éventuelles…"
                    className="resize-none"
                  />
                </FormField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
