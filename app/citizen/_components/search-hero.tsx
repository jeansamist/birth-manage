"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircleIcon, FileSearchIcon, SearchIcon } from "lucide-react"
import { useState } from "react"

interface SearchHeroProps {
  defaultValue: string
  defaultMotherValue?: string
  action: (formData: FormData) => void
  successMessage?: string | null
  errorMessage?: string | null
}

type SearchMode = "id" | "cert" | "name"

export function SearchHero({
  defaultValue,
  defaultMotherValue = "",
  action,
  successMessage,
  errorMessage,
}: SearchHeroProps) {
  const [mode, setMode] = useState<SearchMode>("id")

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl select-none">
      {/* Premium Dark Bento Glows */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-56 w-56 rounded-full bg-[#007A5E]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 -bottom-28 h-56 w-56 rounded-full bg-[#CE1126]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 -translate-y-1/2 rounded-full bg-[#FCD116]/5 blur-3xl" />

      <div className="relative z-10 space-y-8 p-8 md:p-12">
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileSearchIcon className="size-4.5 text-[#FCD116]" />
            <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase">
              République du Cameroun · Système d'État Civil Sécurisé
            </span>
          </div>
          <h1 className="text-xl leading-tight font-black tracking-tight text-white uppercase md:text-2xl">
            Recherche & Vérification Instantanée d'Actes
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-neutral-400">
            Consultez les informations en temps réel sur le traitement de votre
            acte de naissance, téléchargez votre copie officielle signée ou
            initiez des demandes de transfert.
          </p>
        </div>

        {/* Modern Segmented Control for Tabs - Dark Styled */}
        <div className="flex w-full gap-1 rounded-lg border border-white/5 bg-white/5 p-1 sm:w-fit">
          {(["id", "cert", "name"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 cursor-pointer rounded-md px-4 py-2 text-center text-[10px] font-black tracking-wider uppercase transition-all duration-300 sm:flex-initial",
                mode === m
                  ? "bg-white font-bold text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {m === "id" && "Identifiant CID"}
              {m === "cert" && "N° Certificat"}
              {m === "name" && "Nom Enfant"}
            </button>
          ))}
        </div>

        {mode === "id" ? (
          <form
            action={action}
            className="grid items-end gap-6 text-left md:grid-cols-[1fr_1fr_auto]"
          >
            {/* Input Certificat */}
            <div className="space-y-2">
              <Label
                htmlFor="accessId"
                className="block text-[9px] font-black tracking-widest text-neutral-400 uppercase"
              >
                Numéro de Certificat
              </Label>
              <div className="group/input relative">
                <input
                  id="accessId"
                  name="accessId"
                  defaultValue={defaultValue}
                  placeholder="Ex: ACN-2026-ABC-12345678"
                  className="h-14 w-full rounded-md border border-white/10 bg-white/5 pr-12 pl-4 font-mono text-sm font-semibold tracking-wider text-white uppercase placeholder-white/30 transition-all duration-300 outline-none placeholder:font-sans focus:border-white/20 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                  required
                />
                <span className="absolute top-1/2 right-3.5 -translate-y-1/2 font-mono text-[9px] font-black text-neutral-500 group-focus-within/input:text-white">
                  CERT
                </span>
              </div>
              <p className="text-[9px] leading-none text-neutral-500">
                Numéro officiel délivré sur votre acte.
              </p>
            </div>

            {/* Input Nom Mère */}
            <div className="space-y-2">
              <Label
                htmlFor="motherLastName"
                className="block text-[9px] font-black tracking-widest text-neutral-400 uppercase"
              >
                Nom de famille de la Mère / Mother's Surname
              </Label>
              <div className="group/input relative">
                <input
                  id="motherLastName"
                  name="motherLastName"
                  defaultValue={defaultMotherValue}
                  placeholder="Ex: MBALLA"
                  className="h-14 w-full rounded-md border border-white/10 bg-white/5 pl-4 text-sm font-semibold text-white uppercase placeholder-white/30 transition-all duration-300 outline-none focus:border-white/20 focus:bg-white/10 focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
              <p className="text-[9px] leading-none text-neutral-500">
                Validation. Nom de jeune fille requis.
              </p>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="flex h-14 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-10 text-xs font-black tracking-wider text-neutral-900 uppercase shadow-sm transition-all duration-300 hover:bg-neutral-100 active:scale-98 md:w-auto"
            >
              <SearchIcon className="size-4" />
              Rechercher l'acte
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-4 text-left text-xs leading-relaxed font-medium text-amber-500">
            <AlertCircleIcon className="size-4.5 shrink-0 text-amber-500" />
            <span>
              La recherche par{" "}
              {mode === "cert" ? "numéro de certificat" : "nom d'enfant"} est en
              cours de déploiement sécurisé. Veuillez effectuer votre recherche
              à l'aide de l'<strong>Identifiant Unique Citoyen (CID)</strong> et
              du nom de famille de la mère.
            </span>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-left text-xs font-semibold text-green-400">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-left text-xs font-semibold text-destructive-foreground">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
