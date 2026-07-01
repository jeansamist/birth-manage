"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CityHallSelectorProps {
  form: UseFormReturn<any>
  cityHalls: { id: string; name: string; city: string }[]
}

export function CityHallSelector({ form, cityHalls }: CityHallSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
        1. Mairie destinataire / Target City Hall
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="cityHallId" className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
          Sélectionner la Mairie / Select City Hall
        </Label>
        <Select
          value={form.watch("cityHallId")}
          onValueChange={(val) => form.setValue("cityHallId", val, { shouldValidate: true })}
        >
          <SelectTrigger className="h-10 text-xs rounded-md">
            <SelectValue placeholder="Choisir la mairie d'enregistrement" />
          </SelectTrigger>
          <SelectContent>
            {cityHalls.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-xs">
                {c.name} ({c.city})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.cityHallId && (
          <p className="text-[10px] text-destructive font-semibold mt-1">
            {String(form.formState.errors.cityHallId.message)}
          </p>
        )}
      </div>
    </div>
  )
}
