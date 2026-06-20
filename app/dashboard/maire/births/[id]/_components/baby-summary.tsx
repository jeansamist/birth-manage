"use client"

import { SummaryField } from "./summary-field"

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface BabySummaryProps {
  birth: {
    babyFirstName: string | null
    babyLastName: string | null
    babyGender: string | null
    birthDate: Date | null
    birthTime?: string | null
    birthPlace?: string | null
  }
}

export function BabySummary({ birth }: BabySummaryProps) {
  return (
    <div className="rounded-2xl border border-border p-6 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        👶 Informations de l'enfant
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom" value={birth.babyFirstName} />
        <SummaryField label="Nom" value={birth.babyLastName} />
        <SummaryField
          label="Sexe"
          value={birth.babyGender === "MALE" ? "Masculin" : birth.babyGender === "FEMALE" ? "Féminin" : undefined}
        />
        <SummaryField label="Date de naissance" value={fmt(birth.birthDate)} />
        <SummaryField label="Heure de naissance" value={birth.birthTime} />
        <SummaryField label="Lieu de naissance" value={birth.birthPlace} />
      </div>
    </div>
  )
}
