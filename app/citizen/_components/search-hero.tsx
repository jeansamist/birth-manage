"use client"

import { useState } from "react"
import { SearchIcon, FileSearchIcon, AlertCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl relative overflow-hidden select-none">
      {/* Premium Dark Bento Glows */}
      <div className="absolute -top-28 -left-28 w-56 h-56 rounded-full bg-[#007A5E]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-56 h-56 rounded-full bg-[#CE1126]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 rounded-full bg-[#FCD116]/5 blur-3xl pointer-events-none" />

      <div className="p-8 md:p-12 space-y-8 relative z-10">
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileSearchIcon className="size-4.5 text-[#FCD116]" />
            <span className="text-[9px] font-black tracking-widest uppercase text-neutral-400">
              République du Cameroun · Système d'État Civil Sécurisé
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase leading-tight">
            Recherche & Vérification Instantanée d'Actes
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Consultez les informations en temps réel sur le traitement de votre acte de naissance, téléchargez votre copie officielle signée ou initiez des demandes de transfert.
          </p>
        </div>

        {/* Modern Segmented Control for Tabs - Dark Styled */}
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/5 w-full sm:w-fit gap-1">
          {(["id", "cert", "name"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer text-center",
                mode === m
                  ? "bg-white text-neutral-950 shadow-md font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {m === "id" && "Identifiant CID"}
              {m === "cert" && "N° Certificat"}
              {m === "name" && "Nom Enfant"}
            </button>
          ))}
        </div>

        {mode === "id" ? (
          <form action={action} className="grid gap-6 md:grid-cols-[1fr_1fr_auto] items-end text-left">
            {/* Input CID */}
            <div className="space-y-2">
              <Label htmlFor="accessId" className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Identifiant Unique Citoyen (CID)
              </Label>
              <div className="relative group/input">
                <input
                  id="accessId"
                  name="accessId"
                  defaultValue={defaultValue}
                  placeholder="Ex: CID-2026-ABC-12345678"
                  className="w-full uppercase h-14 text-sm rounded-md pl-4 pr-12 border border-white/10 bg-white/5 text-white placeholder-white/30 outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 focus:bg-white/10 transition-all duration-300 font-mono tracking-wider font-semibold placeholder:font-sans"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-[9px] font-black group-focus-within/input:text-white">
                  CID
                </span>
              </div>
              <p className="text-[9px] text-neutral-500 leading-none">Format unique BUNEC délivré à l'accouchement.</p>
            </div>

            {/* Input Nom Mère */}
            <div className="space-y-2">
              <Label htmlFor="motherLastName" className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Nom de famille de la Mère / Mother's Surname
              </Label>
              <div className="relative group/input">
                <input
                  id="motherLastName"
                  name="motherLastName"
                  defaultValue={defaultMotherValue}
                  placeholder="Ex: MBALLA"
                  className="w-full uppercase h-14 text-sm rounded-md pl-4 border border-white/10 bg-white/5 text-white placeholder-white/30 outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 focus:bg-white/10 transition-all duration-300 font-semibold"
                  required
                />
              </div>
              <p className="text-[9px] text-neutral-500 leading-none">Validation. Nom de jeune fille requis.</p>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="h-14 px-10 rounded-md text-xs font-black uppercase tracking-wider cursor-pointer bg-white hover:bg-neutral-100 text-neutral-900 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm w-full md:w-auto shrink-0"
            >
              <SearchIcon className="size-4" />
              Rechercher l'acte
            </Button>
          </form>
        ) : (
          <div className="flex gap-3 items-center bg-amber-500/5 border border-amber-500/20 text-amber-500 p-4 rounded-md text-xs leading-relaxed font-medium text-left">
            <AlertCircleIcon className="size-4.5 shrink-0 text-amber-500" />
            <span>
              La recherche par {mode === "cert" ? "numéro de certificat" : "nom d'enfant"} est en cours de déploiement sécurisé. Veuillez effectuer votre recherche à l'aide de l'<strong>Identifiant Unique Citoyen (CID)</strong> et du nom de famille de la mère.
            </span>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-400 text-left border border-green-500/20">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive-foreground text-left border border-destructive/20">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
