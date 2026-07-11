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
    NATURAL: "Voie basse (Naturel) / Natural",
    CAESAREAN: "Césarienne / Caesarean",
    FORCEPS: "Forceps",
    VACUUM: "Ventouse / Vacuum",
  }

  const deliveryLabel = birth.deliveryType ? (deliveryMapping[birth.deliveryType] || birth.deliveryType) : undefined

  return (
    <div className="rounded-md border border-border p-4 space-y-4 bg-card shadow-xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Données médicales / Medical details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryField label="Poids / Weight" value={birth.weightGrams ? `${birth.weightGrams} g` : undefined} />
        <SummaryField label="Taille / Height" value={birth.heightCm ? `${birth.heightCm} cm` : undefined} />
        <SummaryField label="Apgar" value={birth.apgarScore?.toString()} />
        <SummaryField label="Type d'accouchement / Delivery type" value={deliveryLabel} />
        <SummaryField label="Médecin accoucheur / Doctor" value={`Dr. ${birth.doctor.firstName} ${birth.doctor.lastName}`} />
        <SummaryField label="Hôpital / Hospital" value={birth.hospital.name} />
      </div>
      {birth.medicalNotes && (
        <div className="bg-muted/15 p-3 rounded-md border border-border/50">
          <dt className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Notes médicales / Medical Notes</dt>
          <dd className="font-semibold text-xs text-foreground mt-1 whitespace-pre-line">{birth.medicalNotes}</dd>
        </div>
      )}
    </div>
  )
}
