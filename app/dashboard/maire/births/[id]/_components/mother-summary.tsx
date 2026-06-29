"use client"

import { SummaryField } from "./summary-field"

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface MotherSummaryProps {
  birth: {
    motherFirstName: string | null
    motherLastName: string | null
    motherBirthDate?: Date | null
    motherNationality?: string | null
    motherCni?: string | null
    motherProfession?: string | null
    motherAddress?: string | null
    motherPhone?: string | null
  }
}

export function MotherSummary({ birth }: MotherSummaryProps) {
  return (
    <div className="rounded-2xl border border-border p-6 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        👩 Informations de la mère
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom" value={birth.motherFirstName} />
        <SummaryField label="Nom" value={birth.motherLastName} />
        <SummaryField label="Date de naissance" value={fmt(birth.motherBirthDate)} />
        <SummaryField label="Nationalité" value={birth.motherNationality} />
        <SummaryField label="CNI / Passeport" value={birth.motherCni} />
        <SummaryField label="Profession" value={birth.motherProfession} />
        <SummaryField label="Adresse de résidence" value={birth.motherAddress} />
        <SummaryField label="Téléphone" value={birth.motherPhone ? `+237 ${birth.motherPhone}` : undefined} />
      </div>
    </div>
  )
}
