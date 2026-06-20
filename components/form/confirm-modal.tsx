"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangleIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  isPending?: boolean
  icon?: React.ReactNode
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "default",
  isPending = false,
  icon,
}: ConfirmModalProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative rounded-2xl border border-border bg-background shadow-2xl p-6 space-y-5">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <XIcon className="size-4" />
              </button>

              {/* Icon */}
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full",
                  variant === "destructive"
                    ? "bg-destructive/10"
                    : "bg-primary/10"
                )}
              >
                {icon ?? (
                  <AlertTriangleIcon
                    className={cn(
                      "size-6",
                      variant === "destructive" ? "text-destructive" : "text-primary"
                    )}
                  />
                )}
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isPending}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === "destructive" ? "destructive" : "default"}
                  className="flex-1"
                  onClick={onConfirm}
                  disabled={isPending}
                >
                  {isPending ? "Traitement…" : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
