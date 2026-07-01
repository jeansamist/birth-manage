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
    <div className="rounded-md border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50/50 shadow-sm overflow-hidden">
      {/* Tricolor Ribbon Header */}
      <div className="w-full h-1 flex shrink-0 select-none">
        <div className="flex-1 bg-[#007A5E]" />
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-neutral-600">
            <FileSearchIcon className="size-4.5 text-[#007A5E]" />
            <span className="text-[9px] font-black tracking-widest uppercase text-neutral-500">
              Portail National de l'État Civil · Cameroun
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-black tracking-tight text-neutral-800 uppercase">
            Vérification, Suivi et Téléchargement d'Actes
          </h1>
          <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
            Recherchez l'état de traitement de votre acte, téléchargez sa copie numérique certifiée par signature électronique ou demandez un transfert de dossier.
          </p>
        </div>

        {/* Modern Segmented Control for Tabs */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200/50 w-full sm:w-fit gap-1 select-none">
          {(["id", "cert", "name"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer text-center",
                mode === m
                  ? "bg-white text-[#007A5E] shadow-xs border border-neutral-200/10"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50"
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
              <Label htmlFor="accessId" className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block">
                Identifiant Unique Citoyen (CID)
              </Label>
              <div className="relative group/input">
                <Input
                  id="accessId"
                  name="accessId"
                  defaultValue={defaultValue}
                  placeholder="Ex: CID-2026-ABC-12345678"
                  className="uppercase h-11 text-xs rounded-md pl-4 pr-10 border-neutral-200/80 bg-neutral-50/50 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#007A5E] focus-visible:border-[#007A5E] transition-all duration-300 font-mono tracking-wider font-semibold placeholder:font-sans"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[9px] font-black group-focus-within/input:text-[#007A5E]">
                  CID
                </span>
              </div>
              <p className="text-[9px] text-neutral-400 leading-none">Requis. Format officiel fourni à l'accouchement.</p>
            </div>

            {/* Input Nom Mère */}
            <div className="space-y-2">
              <Label htmlFor="motherLastName" className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block">
                Nom de famille de la Mère / Mother's Surname
              </Label>
              <div className="relative group/input">
                <Input
                  id="motherLastName"
                  name="motherLastName"
                  defaultValue={defaultMotherValue}
                  placeholder="Ex: MBALLA"
                  className="uppercase h-11 text-xs rounded-md pl-4 border-neutral-200/80 bg-neutral-50/50 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#007A5E] focus-visible:border-[#007A5E] transition-all duration-300 font-semibold"
                  required
                />
              </div>
              <p className="text-[9px] text-neutral-400 leading-none">Sécurité. Nom de jeune fille obligatoire.</p>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="h-11 px-8 rounded-md text-xs font-black uppercase tracking-wider cursor-pointer bg-[#007A5E] hover:bg-[#00664f] active:scale-98 transition-all duration-300 text-white flex items-center justify-center gap-2 shadow-sm"
            >
              <SearchIcon className="size-4" />
              Rechercher l'acte
            </Button>
          </form>
        ) : (
          <div className="flex gap-3 items-center bg-amber-500/5 border border-amber-500/20 text-amber-700 p-4 rounded-md text-xs leading-relaxed font-medium text-left">
            <AlertCircleIcon className="size-4.5 shrink-0 text-amber-500" />
            <span>
              La recherche par {mode === "cert" ? "numéro de certificat" : "nom d'enfant"} est en cours de déploiement sécurisé. Veuillez utiliser l'<strong>Identifiant Unique Citoyen (CID)</strong> et le nom de famille de la mère.
            </span>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-700 text-left border border-green-500/20">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive text-left border border-destructive/20">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
