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
    <div className="rounded-2xl border border-border p-6 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        💍 Situation matrimoniale
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Parents mariés" value={birth.parentsMarried ? "Oui" : "Non"} />
        {birth.parentsMarried && (
          <>
            <SummaryField label="N° Acte de mariage" value={birth.marriageCertNumber} />
            <SummaryField label="Date du mariage" value={fmt(birth.marriageDate)} />
          </>
        )}
      </div>
    </div>
  )
}
