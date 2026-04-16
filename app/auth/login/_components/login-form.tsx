"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeftIcon,
  Building2Icon,
  FileTextIcon,
  LandmarkIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  loginAsAdmin,
  loginAsDoctor,
  loginAsCityHallUser,
} from "@/app/actions/auth"
import {
  credentialsSchema,
  type CredentialsInput,
} from "@/lib/schemas/auth"
import type { CityHallOption, HospitalOption, LoginType } from "@/types/auth"

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

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "institution" | "credentials"

interface LoginFormProps {
  hospitals: HospitalOption[]
  cityHalls: CityHallOption[]
}

// ─── Credentials sub-form ─────────────────────────────────────────────────────

interface CredentialsFormProps {
  form: UseFormReturn<CredentialsInput>
  onSubmit: (data: CredentialsInput) => void
  onBack?: () => void
  institutionName?: string
  isPending: boolean
  serverError: string
  isAdmin?: boolean
}

function CredentialsForm({
  form,
  onSubmit,
  onBack,
  institutionName,
  isPending,
  serverError,
  isAdmin,
}: CredentialsFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3" />
          Retour
        </button>
      )}

      {institutionName && (
        <div className="border border-border bg-muted/50 px-3 py-2 text-xs">
          <span className="text-muted-foreground">Établissement : </span>
          <span className="font-medium">{institutionName}</span>
        </div>
      )}

      {isAdmin && (
        <div>
          <p className="text-xs font-medium">Accès Administrateur</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Compte racine avec accès complet à toutes les ressources.
          </p>
        </div>
      )}

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
  )
}

// ─── Institution select step ──────────────────────────────────────────────────

interface InstitutionSelectProps {
  label: string
  description: string
  selectLabel: string
  placeholder: string
  options: { id: string; name: string; city: string }[]
  selectedId: string
  onSelect: (id: string) => void
  onContinue: () => void
}

function InstitutionSelect({
  label,
  description,
  selectLabel,
  placeholder,
  options,
  selectedId,
  onSelect,
  onContinue,
}: InstitutionSelectProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-1.5">
        <Label>{selectLabel}</Label>
        <Select value={selectedId} onValueChange={onSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
                <span className="text-muted-foreground"> — {o.city}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" onClick={onContinue} disabled={!selectedId}>
        Continuer
      </Button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LoginForm({ hospitals, cityHalls }: LoginFormProps) {
  const [loginType, setLoginType] = useState<LoginType>("hospital")
  const [step, setStep] = useState<Step>("institution")
  const [direction, setDirection] = useState(1)
  const [selectedId, setSelectedId] = useState("")
  const [serverError, setServerError] = useState("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { username: "", password: "" },
  })

  function resetFlow() {
    setStep("institution")
    setSelectedId("")
    setServerError("")
    form.reset()
  }

  function handleTabChange(value: string) {
    setLoginType(value as LoginType)
    setDirection(1)
    resetFlow()
  }

  function handleContinue() {
    if (!selectedId) return
    setDirection(1)
    setStep("credentials")
    setServerError("")
  }

  function handleBack() {
    setDirection(-1)
    setStep("institution")
    setServerError("")
    form.reset()
  }

  function handleSubmit(data: CredentialsInput) {
    setServerError("")
    startTransition(async () => {
      let result

      if (loginType === "hospital") {
        result = await loginAsDoctor({
          hospitalId: selectedId,
          ...data,
        })
      } else if (loginType === "city-hall") {
        result = await loginAsCityHallUser({
          cityHallId: selectedId,
          ...data,
        })
      } else {
        result = await loginAsAdmin(data)
      }

      if (result && !result.success) {
        setServerError(result.error?.message ?? "Une erreur est survenue.")
      }
    })
  }

  const selectedName =
    loginType === "hospital"
      ? hospitals.find((h) => h.id === selectedId)?.name
      : cityHalls.find((c) => c.id === selectedId)?.name

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
        <CardContent className="p-0">
          <Tabs value={loginType} onValueChange={handleTabChange}>
            {/* Tab list */}
            <TabsList
              variant="line"
              className="h-auto w-full gap-0 rounded-none border-b border-border bg-transparent px-3 pb-0 pt-2"
            >
              <TabsTrigger value="hospital" className="flex-1 gap-1 pb-2">
                <Building2Icon className="size-3" />
                Hôpital
              </TabsTrigger>
              <TabsTrigger value="city-hall" className="flex-1 gap-1 pb-2">
                <LandmarkIcon className="size-3" />
                Mairie
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 gap-1 pb-2">
                <ShieldCheckIcon className="size-3" />
                Admin
              </TabsTrigger>
            </TabsList>

            {/* ── Hospital tab ── */}
            <TabsContent value="hospital" className="mt-0 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === "institution" ? (
                  <motion.div
                    key="h-select"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-4"
                  >
                    <InstitutionSelect
                      label="Sélectionnez votre hôpital"
                      description="Votre compte doit être approuvé dans cet établissement."
                      selectLabel="Établissement hospitalier"
                      placeholder="Choisir un hôpital…"
                      options={hospitals}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onContinue={handleContinue}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="h-creds"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-4"
                  >
                    <CredentialsForm
                      form={form}
                      onSubmit={handleSubmit}
                      onBack={handleBack}
                      institutionName={selectedName}
                      isPending={isPending}
                      serverError={serverError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* ── City Hall tab ── */}
            <TabsContent value="city-hall" className="mt-0 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === "institution" ? (
                  <motion.div
                    key="ch-select"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-4"
                  >
                    <InstitutionSelect
                      label="Sélectionnez votre mairie"
                      description="Connectez-vous avec votre rôle (Maire, Secrétaire ou Mainteneur)."
                      selectLabel="Mairie / Commune"
                      placeholder="Choisir une mairie…"
                      options={cityHalls}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onContinue={handleContinue}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ch-creds"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-4"
                  >
                    <CredentialsForm
                      form={form}
                      onSubmit={handleSubmit}
                      onBack={handleBack}
                      institutionName={selectedName}
                      isPending={isPending}
                      serverError={serverError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* ── Admin tab ── */}
            <TabsContent value="admin" className="mt-0">
              <div className="p-4">
                <CredentialsForm
                  form={form}
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  serverError={serverError}
                  isAdmin
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
