"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { birthFormSchema, type BirthFormInput } from "@/lib/schemas/birth"
import { saveBirthDraft, submitBirthToCityHall } from "@/app/actions/birth"
import type { SaveState } from "@/components/form/auto-save-indicator"

export function useBirthForm(initialData?: Partial<BirthFormInput>, id?: string, defaultBirthPlace?: string) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [savedId, setSavedId] = useState<string | undefined>(id)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [fatherUnknown, setFatherUnknown] = useState(
    initialData ? !initialData.fatherFirstName && !initialData.fatherLastName && !initialData.parentsMarried : false
  )
  const [isPending, startTransition] = useTransition()

  const form = useForm<BirthFormInput>({
    resolver: zodResolver(birthFormSchema),
    mode: "onBlur",
    defaultValues: {
      parentsMarried: false,
      birthDate: new Date().toISOString().split("T")[0],
      birthTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace("h", ":"),
      birthPlace: defaultBirthPlace ?? "",
      ...initialData,
    },
  })

  const values = form.watch()
  useEffect(() => {
    if (isPending) return
    const timer = setTimeout(() => {
      setSaveState("saving")
      startTransition(async () => {
        const result = await saveBirthDraft(form.getValues(), savedId)
        if (result.success && result.id) {
          setSavedId(result.id)
          setSaveState("saved")
          setSavedAt(new Date())
        } else {
          setSaveState("error")
        }
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [values, savedId, isPending])

  const triggerSave = async () => {
    setSaveState("saving")
    const result = await saveBirthDraft(form.getValues(), savedId)
    if (result.success && result.id) {
      setSavedId(result.id)
      setSaveState("saved")
      setSavedAt(new Date())
    }
  }

  return {
    step,
    setStep,
    direction,
    setDirection,
    savedId,
    saveState,
    setSaveState,
    savedAt,
    serverError,
    setServerError,
    confirmOpen,
    setConfirmOpen,
    fatherUnknown,
    setFatherUnknown,
    isPending,
    startTransition,
    form,
    triggerSave,
  }
}
