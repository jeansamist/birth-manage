"use client"

import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { FormField, SectionTitle } from "./form-primitives"

interface StepFatherProps {
  form: UseFormReturn<BirthFormInput>
  fatherUnknown: boolean
  onToggle: (unknown: boolean) => void
}

export function StepFather({ form, fatherUnknown, onToggle }: StepFatherProps) {
  const { register } = form

  return (
    <div className="space-y-6">
      <SectionTitle>👨 Informations sur le père</SectionTitle>

      {/* Known / Unknown toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
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
            "flex-1 py-3 text-sm font-medium transition-colors",
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
                <Input
                  type="date"
                  {...register("fatherBirthDate")}
                  className="h-10"
                />
              </FormField>
              <FormField label="Nationalité">
                <Input
                  {...register("fatherNationality")}
                  placeholder="Camerounais"
                  className="h-10"
                />
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
