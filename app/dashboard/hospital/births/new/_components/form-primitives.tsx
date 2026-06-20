// Shared primitive form components reused across all steps
"use client"

import { motion } from "framer-motion"

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-destructive mt-1.5 flex items-center gap-1"
    >
      <span className="flex size-3 items-center justify-center rounded-full bg-destructive/20 text-[9px] font-bold shrink-0">
        !
      </span>
      {message}
    </motion.p>
  )
}

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-foreground">
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
    <div className="flex items-center gap-3 pb-1">
      <h2 className="text-sm font-semibold text-foreground shrink-0">{children}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
}: {
  value?: string
  onChange: (val: string) => void
  placeholder?: string
}) {
  const dateValue = value ? new Date(value) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-9 justify-start text-left font-normal px-3 rounded-md border text-sm shadow-xs cursor-pointer",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
          {dateValue ? format(dateValue, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              const yyyy = date.getFullYear()
              const mm = String(date.getMonth() + 1).padStart(2, "0")
              const dd = String(date.getDate()).padStart(2, "0")
              onChange(`${yyyy}-${mm}-${dd}`)
            } else {
              onChange("")
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
