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
      <div className="rounded-md border border-border p-4 bg-card shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
          Informations du père / Father's details
        </h3>
        <p className="text-xs text-muted-foreground italic">Non déclaré / Father unknown</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Informations du père / Father's details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom / First name" value={birth.fatherFirstName} />
        <SummaryField label="Nom / Family name" value={birth.fatherLastName} />
        <SummaryField label="Date de naissance / Date of birth" value={fmt(birth.fatherBirthDate)} />
        <SummaryField label="Nationalité / Nationality" value={birth.fatherNationality} />
        <SummaryField label="N° CNI ou Passeport / NIC No. or passport" value={birth.fatherCni} />
        <SummaryField label="Profession / Occupation" value={birth.fatherProfession} />
        <SummaryField label="Adresse de résidence / Domicile Address" value={birth.fatherAddress} />
        <SummaryField label="Téléphone / Phone" value={birth.fatherPhone ? `+237 ${birth.fatherPhone}` : undefined} />
      </div>
    </div>
  )
}
