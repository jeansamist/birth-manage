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

  // Sauvegarde automatique après 2 secondes d'inactivité sur n'importe quel champ
  const watchedValues = form.watch()
  const serializedValues = JSON.stringify(watchedValues)
  useEffect(() => {
    if (!form.formState.isDirty) return

    const timer = setTimeout(() => {
      triggerSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [serializedValues, form.formState.isDirty])

  const triggerSave = async () => {
    setSaveState("saving")
    try {
      const result = await saveBirthDraft(form.getValues(), savedId)
      if (result.success && result.id) {
        setSavedId(result.id)
        setSaveState("saved")
        setSavedAt(new Date())
        return result.id
      } else {
        setSaveState("error")
        return null
      }
    } catch {
      setSaveState("error")
      return null
    }
  }

  const handleFinalSubmit = () => {
    setConfirmOpen(false)
    setServerError(null)
    setSaveState("saving")
    startTransition(async () => {
      const result = await submitBirthToCityHall(form.getValues(), savedId)
      if (result && !result.success) {
        setServerError(result.error ?? "Une erreur est survenue.")
        setSaveState("error")
      }
    })
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
    handleFinalSubmit,
  }
}
