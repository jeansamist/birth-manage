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
    <div className="rounded-md border border-border bg-card p-6 md:p-8 shadow-xs space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-neutral-700">
          <FileSearchIcon className="size-5 text-neutral-600" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Portail Citoyen Camerounais / Cameroonian Citizen Portal
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800 uppercase">
          Vérification et Suivi d'Acte de Naissance
        </h1>
        <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
          Recherchez et suivez l'état de traitement de votre déclaration de naissance ou demandez un transfert de copie d'acte vers une autre mairie.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["id", "cert", "name"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer uppercase tracking-wider",
              mode === m
                ? "border-neutral-800 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            {m === "id" && "Identifiant Unique / CID"}
            {m === "cert" && "N° Certificat"}
            {m === "name" && "Nom Enfant"}
          </button>
        ))}
      </div>

      {mode === "id" ? (
        <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
          <div className="space-y-1.5">
            <Label htmlFor="accessId" className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
              Identifiant Unique Citoyen / CID
            </Label>
            <Input
              id="accessId"
              name="accessId"
              defaultValue={defaultValue}
              placeholder="Ex. CID-2026-ABC-12345678"
              className="uppercase h-10 text-sm rounded-md"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="motherLastName" className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
              Nom de famille de la mère / Mother's Last Name
            </Label>
            <Input
              id="motherLastName"
              name="motherLastName"
              defaultValue={defaultMotherValue}
              placeholder="Ex. Mballa"
              className="uppercase h-10 text-sm rounded-md"
              required
            />
          </div>
          <Button type="submit" className="h-10 px-6 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-neutral-800 hover:bg-neutral-900 text-white">
            <SearchIcon className="size-3.5 mr-2" />
            Rechercher
          </Button>
        </form>
      ) : (
        <div className="flex gap-2.5 items-center bg-amber-500/5 border border-amber-500/20 text-amber-700 p-4 rounded-md text-xs leading-relaxed font-medium">
          <AlertCircleIcon className="size-4 shrink-0 text-amber-500" />
          <span>
            La recherche par {mode === "cert" ? "numéro de certificat" : "nom d'enfant"} est en cours de déploiement sécurisé. Veuillez utiliser l'<strong>Identifiant Unique Citoyen</strong> et le nom de la mère pour effectuer vos recherches.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-700">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
