"use client"

import { useState } from "react"
import { SearchIcon, FileSearchIcon, AlertCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SearchHeroProps {
  defaultValue: string
  action: (formData: FormData) => void
  successMessage?: string | null
  errorMessage?: string | null
}

type SearchMode = "id" | "cert" | "name"

export function SearchHero({ defaultValue, action, successMessage, errorMessage }: SearchHeroProps) {
  const [mode, setMode] = useState<SearchMode>("id")

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <FileSearchIcon className="size-5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Portail Citoyen Camerounais
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Vérification et Suivi d'Acte de Naissance
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
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
              "px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer",
              mode === m
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "id" && "🔑 Identifiant Unique"}
            {m === "cert" && "📄 N° Certificat"}
            {m === "name" && "👶 Nom Enfant"}
          </button>
        ))}
      </div>

      {mode === "id" ? (
        <form action={action} className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <div className="space-y-1.5">
            <Label htmlFor="accessId" className="text-xs font-medium text-muted-foreground uppercase">
              Identifiant Unique Citoyen
            </Label>
            <Input
              id="accessId"
              name="accessId"
              defaultValue={defaultValue}
              placeholder="Ex. CID-2026-ABC-12345678"
              className="uppercase h-12 text-base rounded-xl"
              required
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-xl text-base font-semibold cursor-pointer">
            <SearchIcon className="size-4 mr-2" />
            Rechercher
          </Button>
        </form>
      ) : (
        <div className="flex gap-2.5 items-center bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl text-xs leading-relaxed font-medium">
          <AlertCircleIcon className="size-4 shrink-0 text-amber-500" />
          <span>
            La recherche par {mode === "cert" ? "numéro de certificat" : "nom d'enfant"} est en cours de déploiement sécurisé. Veuillez utiliser l'<strong>Identifiant Unique Citoyen</strong> pour effectuer vos recherches.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
