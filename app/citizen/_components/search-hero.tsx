"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CheckCircle2Icon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react"
import type { ComponentType } from "react"

interface SearchHeroProps {
  defaultValue: string
  defaultMotherValue?: string
  action: (formData: FormData) => void
  successMessage?: string | null
  errorMessage?: string | null
}

export function SearchHero({
  defaultValue,
  defaultMotherValue = "",
  action,
  successMessage,
  errorMessage,
}: SearchHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-muted/30 shadow-lg shadow-primary/5">
      {/* Tricolor top edge */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-1.5">
        <div className="flex-1 bg-[#007A5E]" />
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
      </div>

      {/* Soft brand glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative space-y-8 p-6 sm:p-10 md:p-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <ShieldCheckIcon className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold tracking-wide text-primary uppercase">
              République du Cameroun · État Civil
            </span>
          </div>
          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-foreground sm:text-3xl">
            Retrouvez votre acte de naissance
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Entrez le numéro de certificat et le nom de la mère pour consulter
            votre dossier et demander un transfert vers une autre mairie.
          </p>
        </div>

        <form
          action={action}
          className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2"
        >
          {/* Input Certificat */}
          <div className="space-y-1.5 text-left">
            <Label
              htmlFor="accessId"
              className="text-xs font-semibold text-foreground"
            >
              Numéro de certificat
            </Label>
            <div className="relative">
              <FileTextIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="accessId"
                name="accessId"
                defaultValue={defaultValue}
                placeholder="Ex: ACN-2026-ABC-12345678"
                className="h-14 w-full rounded-2xl border border-input bg-background pr-4 pl-11 font-mono text-sm font-semibold tracking-wide text-foreground uppercase shadow-xs transition-all outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/50 placeholder:normal-case focus:border-primary focus:ring-4 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          {/* Input Nom Mère */}
          <div className="space-y-1.5 text-left">
            <Label
              htmlFor="motherLastName"
              className="text-xs font-semibold text-foreground"
            >
              Nom de famille de la mère
            </Label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="motherLastName"
                name="motherLastName"
                defaultValue={defaultMotherValue}
                placeholder="Ex: MBALLA"
                className="h-14 w-full rounded-2xl border border-input bg-background pr-4 pl-11 text-sm font-semibold text-foreground uppercase shadow-xs transition-all outline-none placeholder:font-normal placeholder:text-muted-foreground/50 placeholder:normal-case focus:border-primary focus:ring-4 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-2xl text-sm font-bold tracking-wide sm:col-span-2"
          >
            <SearchIcon className="size-4.5" />
            Rechercher mon acte
          </Button>
        </form>

        {/* Trust indicators */}
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/60 pt-6">
          <TrustItem icon={ShieldCheckIcon} label="Données sécurisées" />
          <TrustItem icon={ZapIcon} label="Résultat instantané" />
          <TrustItem icon={BadgeCheckIcon} label="Document officiel" />
        </div>

        {successMessage && (
          <div className="mx-auto flex max-w-2xl items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-left text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2Icon className="size-4.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-auto flex max-w-2xl items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-left text-xs font-semibold text-destructive">
            <AlertCircleIcon className="size-4.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="size-4 text-primary" />
      <span className="text-[11px] font-semibold">{label}</span>
    </div>
  )
}
