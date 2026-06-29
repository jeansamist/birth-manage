"use client"

import { SummaryField } from "./summary-field"

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface FatherSummaryProps {
  birth: {
    fatherFirstName?: string | null
    fatherLastName?: string | null
    fatherBirthDate?: Date | null
    fatherNationality?: string | null
    fatherCni?: string | null
    fatherProfession?: string | null
    fatherAddress?: string | null
    fatherPhone?: string | null
  }
}

export function FatherSummary({ birth }: FatherSummaryProps) {
  const hasFather = !!(birth.fatherFirstName || birth.fatherLastName)

  if (!hasFather) {
    return (
      <div className="rounded-2xl border border-border p-6 bg-card shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          👨 Informations du père
        </h3>
        <p className="text-xs text-muted-foreground italic">Non déclaré (Père inconnu)</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border p-6 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        👨 Informations du père
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom" value={birth.fatherFirstName} />
        <SummaryField label="Nom" value={birth.fatherLastName} />
        <SummaryField label="Date de naissance" value={fmt(birth.fatherBirthDate)} />
        <SummaryField label="Nationalité" value={birth.fatherNationality} />
        <SummaryField label="CNI / Passeport" value={birth.fatherCni} />
        <SummaryField label="Profession" value={birth.fatherProfession} />
        <SummaryField label="Adresse de résidence" value={birth.fatherAddress} />
        <SummaryField label="Téléphone" value={birth.fatherPhone ? `+237 ${birth.fatherPhone}` : undefined} />
      </div>
    </div>
  )
}
