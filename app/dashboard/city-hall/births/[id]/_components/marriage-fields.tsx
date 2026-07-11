"use client"

import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField, DatePicker } from "@/app/dashboard/hospital/births/new/_components/form-primitives"
import { cn } from "@/lib/utils"

export function MarriageFields({ form }: { form: UseFormReturn<any> }) {
  const { register, control, watch, setValue } = form
  const parentsMarried = watch("parentsMarried")

  return (
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Situation matrimoniale / Marital Status
      </h3>

      <div className="flex rounded-md border border-border overflow-hidden h-10">
        <button
          type="button"
          onClick={() => setValue("parentsMarried", false)}
          className={cn(
            "flex-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
            !parentsMarried ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          Non mariés / Unmarried
        </button>
        <button
          type="button"
          onClick={() => setValue("parentsMarried", true)}
          className={cn(
            "flex-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
            parentsMarried ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
          )}
        >
          Mariés / Married
        </button>
      </div>

      {parentsMarried && (
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      )}
    </div>
  )
}
