"use client"

import { SummaryField } from "./summary-field"

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface MarriageSummaryProps {
  birth: {
    parentsMarried: boolean
    marriageCertNumber?: string | null
    marriageDate?: Date | null
  }
}

export function MarriageSummary({ birth }: MarriageSummaryProps) {
  return (
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
        Situation matrimoniale / Marital Status
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Parents mariés / Married" value={birth.parentsMarried ? "Oui / Yes" : "Non / No"} />
        {birth.parentsMarried && (
          <>
            <SummaryField label="N° Acte de mariage / Marriage Cert No." value={birth.marriageCertNumber} />
            <SummaryField label="Date du mariage / Marriage Date" value={fmt(birth.marriageDate)} />
          </>
        )}
      </div>
    </div>
  )
}
