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
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Informations de l'enfant / Child details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom / First name" value={birth.babyFirstName} />
        <SummaryField label="Nom / Family name" value={birth.babyLastName} />
        <SummaryField
          label="Sexe / Gender"
          value={birth.babyGender === "MALE" ? "Masculin / Male" : birth.babyGender === "FEMALE" ? "Féminin / Female" : undefined}
        />
        <SummaryField label="Date de naissance / Date of birth" value={fmt(birth.birthDate)} />
        <SummaryField label="Heure de naissance / Time of birth" value={birth.birthTime} />
        <SummaryField label="Lieu de naissance / Place of birth" value={birth.birthPlace} />
      </div>
    </div>
  )
}
