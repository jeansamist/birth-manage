"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-destructive mt-1 flex items-center gap-1 font-sans"
    >
      <span className="flex size-3.5 items-center justify-center rounded-xs bg-destructive/10 text-[9px] font-bold shrink-0">
        !
      </span>
      {message}
    </motion.p>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5 font-sans">
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-2 pt-1 border-b border-neutral-200">
      <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider shrink-0">{children}</h2>
      <div className="flex-1" />
    </div>
  )
}

interface DatePickerProps {
  value?: string
  onChange: (val: string) => void
  placeholder?: string
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  // Use a clean native HTML date input for standard bult-in calendar/year/month dropdowns
  return (
    <Input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm text-black focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 cursor-pointer outline-none"
    />
  )
}
