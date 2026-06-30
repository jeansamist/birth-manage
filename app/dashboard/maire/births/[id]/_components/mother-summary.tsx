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
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
        Informations de la mère / Mother's details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Prénom / First name" value={birth.motherFirstName} />
        <SummaryField label="Nom / Family name" value={birth.motherLastName} />
        <SummaryField label="Date de naissance / Date of birth" value={fmt(birth.motherBirthDate)} />
        <SummaryField label="Nationalité / Nationality" value={birth.motherNationality} />
        <SummaryField label="N° CNI ou Passeport / NIC No. or passport" value={birth.motherCni} />
        <SummaryField label="Profession / Occupation" value={birth.motherProfession} />
        <SummaryField label="Adresse de résidence / Domicile Address" value={birth.motherAddress} />
        <SummaryField label="Téléphone / Phone" value={birth.motherPhone ? `+237 ${birth.motherPhone}` : undefined} />
      </div>
    </div>
  )
}
