"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeftIcon,
  Building2Icon,
  EyeIcon,
  EyeOffIcon,
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
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 shadow-sm">
          <FileTextIcon className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Gestion des Actes de Naissance
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Plateforme Numérique d&apos;État Civil du Cameroun
        </p>
      </div>

      <Card className="border border-border/60 shadow-lg shadow-black/5">
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
                className="p-6"
              >
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  <div>
                    <p className="text-sm font-semibold">Connexion</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Votre espace est déterminé automatiquement selon votre compte.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="gap-1.5 text-sm">
                        <UserIcon className="size-3.5" />
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

                    <div className="space-y-2">
                      <Label htmlFor="password" className="gap-1.5 text-sm">
                        <LockIcon className="size-3.5" />
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          aria-invalid={!!form.formState.errors.password}
                          className="pr-10"
                          {...form.register("password")}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="size-4" />
                          ) : (
                            <EyeIcon className="size-4" />
                          )}
                        </button>
                      </div>
                      {form.formState.errors.password && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {serverError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      {serverError}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isPending}>
                    {isPending && <Spinner className="size-4" />}
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
                className="p-6"
              >
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeftIcon className="size-4" />
                    Retour
                  </button>

                  <div>
                    <p className="text-sm font-semibold">Choisissez votre hôpital</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Votre compte est approuvé dans plusieurs établissements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {hospitalChoices.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHospitalId(h.id)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                          selectedHospitalId === h.id
                            ? "border-primary bg-primary/5 font-medium shadow-sm"
                            : "border-border hover:bg-muted/50 hover:shadow-sm"
                        }`}
                      >
                        <Building2Icon className="size-4 shrink-0 text-muted-foreground" />
                        <span>
                          {h.name}
                          <span className="text-muted-foreground"> — {h.city}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {serverError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      {serverError}
                    </div>
                  )}

                  <Button
                    className="w-full h-11 text-sm font-semibold"
                    disabled={isPending || !selectedHospitalId}
                    onClick={() => submitLogin(selectedHospitalId)}
                  >
                    {isPending && <Spinner className="size-4" />}
                    {isPending ? "Connexion en cours…" : "Continuer"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BUNEC — Bureau National de l&apos;État Civil
      </p>
    </div>
  )
}
