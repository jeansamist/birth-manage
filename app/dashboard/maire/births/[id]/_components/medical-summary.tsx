"use client"

import { SummaryField } from "./summary-field"

interface MedicalSummaryProps {
  birth: {
    weightGrams?: number | null
    heightCm?: number | null
    apgarScore?: number | null
    deliveryType?: string | null
    doctor: {
      firstName: string
      lastName: string
    }
    hospital: {
      name: string
    }
    medicalNotes?: string | null
  }
}

export function MedicalSummary({ birth }: MedicalSummaryProps) {
  const deliveryMapping: Record<string, string> = {
    NATURAL: "Voie basse (Naturel)",
    CAESAREAN: "Césarienne",
    FORCEPS: "Forceps",
    VACUUM: "Ventouse",
  }

  const deliveryLabel = birth.deliveryType ? (deliveryMapping[birth.deliveryType] || birth.deliveryType) : undefined

  return (
    <div className="rounded-2xl border border-border p-6 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        🏥 Données médicales
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Poids" value={birth.weightGrams ? `${birth.weightGrams} g` : undefined} />
        <SummaryField label="Taille" value={birth.heightCm ? `${birth.heightCm} cm` : undefined} />
        <SummaryField label="Apgar" value={birth.apgarScore?.toString()} />
        <SummaryField label="Type d'accouchement" value={deliveryLabel} />
        <SummaryField label="Médecin accoucheur" value={`Dr. ${birth.doctor.firstName} ${birth.doctor.lastName}`} />
        <SummaryField label="Hôpital" value={birth.hospital.name} />
      </div>
      {birth.medicalNotes && (
        <div className="bg-muted/15 p-4 rounded-xl border border-border/50">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Notes médicales</dt>
          <dd className="font-semibold text-sm text-foreground mt-1 whitespace-pre-line">{birth.medicalNotes}</dd>
        </div>
      )}
    </div>
  )
}
