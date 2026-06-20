"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StepFatherProps {
  form: UseFormReturn<BirthFormInput>
  fatherUnknown: boolean
  onToggle: (unknown: boolean) => void
}

export function StepFather({ form, fatherUnknown, onToggle }: StepFatherProps) {
  const { register, control } = form

  const quickNationalities = [
    { label: "🇨🇲 Camerounais", value: "Camerounais" },
    { label: "🇫🇷 Français", value: "Français" },
    { label: "🇳G Nigérian", value: "Nigérian" },
  ]

  return (
    <div className="space-y-6">
      <SectionTitle>👨 Informations sur le père</SectionTitle>

      {/* Known / Unknown toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors cursor-pointer",
            !fatherUnknown
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          👨 Père connu
        </button>
        <button
          type="button"
          onClick={() => onToggle(true)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors cursor-pointer",
            fatherUnknown
              ? "bg-primary text-primary-foreground"
              : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          ❓ Père inconnu
        </button>
      </div>

      {fatherUnknown ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
        >
          Le père ne sera pas renseigné sur l'acte de naissance.
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-xs text-muted-foreground">
            Ces informations sont facultatives mais recommandées.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Prénom">
              <Input
                {...register("fatherFirstName")}
                placeholder="Serge"
                className="h-10"
              />
            </FormField>
            <FormField label="Nom">
              <Input
                {...register("fatherLastName")}
                placeholder="Mballa"
                className="h-10"
              />
            </FormField>
          </div>

          {/* Identity block */}
          <div className="rounded-xl border border-border p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              🪪 Identité & Documents
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date de naissance">
                <Controller
                  control={control}
                  name="fatherBirthDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Date de naissance"
                    />
                  )}
                />
              </FormField>
              <FormField label="Nationalité">
                <Input
                  {...register("fatherNationality")}
                  placeholder="Camerounais"
                  className="h-10"
                />
                {/* Quick Nationality Pills */}
                <div className="flex gap-1.5 mt-1.5">
                  {quickNationalities.map((nat) => (
                    <button
                      key={nat.value}
                      type="button"
                      onClick={() => form.setValue("fatherNationality", nat.value)}
                      className="text-[10px] border px-2 py-0.5 rounded hover:bg-muted cursor-pointer"
                    >
                      {nat.label}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="CNI / Passeport">
                <Input
                  {...register("fatherCni")}
                  placeholder="987654321"
                  className="h-10"
                />
              </FormField>
              <FormField label="Profession">
                <Input
                  {...register("fatherProfession")}
                  placeholder="Ingénieur"
                  className="h-10"
                />
              </FormField>
            </div>
            <FormField label="Adresse">
              <Input
                {...register("fatherAddress")}
                placeholder="Quartier, ville"
                className="h-10"
              />
            </FormField>
            <FormField label="Téléphone">
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
                  +237
                </span>
                <Input
                  type="tel"
                  {...register("fatherPhone")}
                  placeholder="6XX XXX XXX"
                  className="h-10 rounded-l-none"
                />
              </div>
            </FormField>
          </div>
        </motion.div>
      )}
    </div>
  )
}
