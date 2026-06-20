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
