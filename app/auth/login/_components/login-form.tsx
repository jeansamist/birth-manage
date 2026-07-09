"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeftIcon,
  Building2Icon,
  FileTextIcon,
  LockIcon,
  UserIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { login } from "@/app/actions/auth"
import {
  credentialsSchema,
  type CredentialsInput,
} from "@/lib/schemas/auth"
import type { HospitalOption } from "@/types/auth"

// ─── Animation ────────────────────────────────────────────────────────────────

const slide = {
  enter: (dir: number) => ({ x: dir * 20, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.18 } },
  exit: (dir: number) => ({
    x: dir * -20,
    opacity: 0,
    transition: { duration: 0.14 },
  }),
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LoginForm() {
  const [serverError, setServerError] = useState("")
  const [hospitalChoices, setHospitalChoices] = useState<HospitalOption[] | null>(null)
  const [selectedHospitalId, setSelectedHospitalId] = useState("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { username: "", password: "" },
  })

  function submitLogin(hospitalId?: string) {
    setServerError("")
    startTransition(async () => {
      const result = await login({ ...form.getValues(), hospitalId })
      if (!result) return // redirection en cours
      if (!result.success) {
        setServerError(result.error?.message ?? "Une erreur est survenue.")
        return
      }
      if (result.requiresHospitalChoice && result.hospitals) {
        setHospitalChoices(result.hospitals)
        setSelectedHospitalId("")
      }
    })
  }

  function handleSubmit() {
    submitLogin()
  }

  function handleBack() {
    setHospitalChoices(null)
    setSelectedHospitalId("")
    setServerError("")
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex size-10 items-center justify-center border border-border bg-primary/5">
          <FileTextIcon className="size-4 text-primary" />
        </div>
        <h1 className="font-heading text-sm font-semibold">
          Gestion des Actes de Naissance
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Plateforme Numérique d&apos;État Civil du Cameroun
        </p>
      </div>

      <Card>
        <CardContent className="overflow-hidden p-0">
          <AnimatePresence mode="wait" initial={false}>
            {hospitalChoices === null ? (
              <motion.div
                key="credentials"
                custom={-1}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-4"
              >
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-xs font-medium">Connexion</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Votre espace est déterminé automatiquement selon votre compte.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="username" className="gap-1.5">
                        <UserIcon className="size-3" />
                        Nom d&apos;utilisateur
                      </Label>
                      <Input
                        id="username"
                        autoComplete="username"
                        placeholder="nom.utilisateur"
                        aria-invalid={!!form.formState.errors.username}
                        {...form.register("username")}
                      />
                      {form.formState.errors.username && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="gap-1.5">
                        <LockIcon className="size-3" />
                        Mot de passe
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        aria-invalid={!!form.formState.errors.password}
                        {...form.register("password")}
                      />
                      {form.formState.errors.password && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {serverError && (
                    <p className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      {serverError}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Spinner className="size-3.5" />}
                    {isPending ? "Connexion en cours…" : "Se connecter"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="hospital-choice"
                custom={1}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-4"
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeftIcon className="size-3" />
                    Retour
                  </button>

                  <div>
                    <p className="text-xs font-medium">Choisissez votre hôpital</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Votre compte est approuvé dans plusieurs établissements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {hospitalChoices.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHospitalId(h.id)}
                        className={`flex w-full items-center gap-2 border px-3 py-2.5 text-left text-xs transition-colors ${
                          selectedHospitalId === h.id
                            ? "border-primary bg-primary/5 font-medium"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <Building2Icon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span>
                          {h.name}
                          <span className="text-muted-foreground"> — {h.city}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {serverError && (
                    <p className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      {serverError}
                    </p>
                  )}

                  <Button
                    className="w-full"
                    disabled={isPending || !selectedHospitalId}
                    onClick={() => submitLogin(selectedHospitalId)}
                  >
                    {isPending && <Spinner className="size-3.5" />}
                    {isPending ? "Connexion en cours…" : "Continuer"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
