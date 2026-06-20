"use client"

import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"
import { Input } from "@/components/ui/input"
import { Controller } from "react-hook-form"
import { FormField, SectionTitle, DatePicker } from "./form-primitives"

interface StepMotherProps {
  form: UseFormReturn<BirthFormInput>
}

export function StepMother({ form }: StepMotherProps) {
  const { register, control, formState: { errors } } = form

  const quickNationalities = [
    { label: "🇨🇲 Camerounaise", value: "Camerounaise" },
    { label: "🇫🇷 Française", value: "Française" },
    { label: "🇳G Nigériane", value: "Nigériane" },
  ]

  return (
    <div className="space-y-6">
      <SectionTitle>👩 Informations sur la mère</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Prénom"
          required
          error={errors.motherFirstName?.message}
        >
          <Input
            {...register("motherFirstName")}
            placeholder="Amina"
            className="h-10"
          />
        </FormField>
        <FormField
          label="Nom"
          required
          error={errors.motherLastName?.message}
        >
          <Input
            {...register("motherLastName")}
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
              name="motherBirthDate"
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
              {...register("motherNationality")}
              placeholder="Camerounaise"
              className="h-10"
            />
            {/* Quick Nationality Pills */}
            <div className="flex gap-1.5 mt-1.5">
              {quickNationalities.map((nat) => (
                <button
                  key={nat.value}
                  type="button"
                  onClick={() => form.setValue("motherNationality", nat.value)}
                  className="text-[10px] border px-2 py-0.5 rounded hover:bg-muted cursor-pointer"
                >
                  {nat.label}
                </button>
              ))}
            </div>
          </FormField>
        </div>
        <FormField label="CNI / Passeport">
          <Input
            {...register("motherCni")}
            placeholder="123456789"
            className="h-10"
          />
        </FormField>
      </div>

      {/* Contact block */}
      <div className="rounded-xl border border-border p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          💼 Contact & Profession
        </p>
        <FormField label="Profession">
          <Input
            {...register("motherProfession")}
            placeholder="Enseignante"
            className="h-10"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Téléphone">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
                +237
              </span>
              <Input
                type="tel"
                {...register("motherPhone")}
                placeholder="6XX XXX XXX"
                className="h-10 rounded-l-none"
              />
            </div>
          </FormField>
          <FormField label="Email" error={errors.motherEmail?.message}>
            <Input
              type="email"
              {...register("motherEmail")}
              placeholder="amina@email.com"
              className="h-10"
            />
          </FormField>
        </div>
        <FormField label="Adresse">
          <Input
            {...register("motherAddress")}
            placeholder="Quartier, ville"
            className="h-10"
          />
        </FormField>
      </div>
    </div>
  )
}
