"use client"

import { BadgeCheckIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface RecordDetailsProps {
  birth: {
    babyFirstName: string | null
    babyLastName: string | null
    birthDate: Date | null
    certificateNumber?: string | null
    citizenAccessId?: string | null
    hospital: {
      name: string
      city: string
    }
    cityHall: {
      name: string
      city: string
    } | null
  }
}

export function RecordDetails({ birth }: RecordDetailsProps) {
  return (
    <Card className="rounded-2xl border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between gap-3 text-base font-bold">
          Dossier d'Acte de Naissance
          <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-1 py-1 px-2.5 rounded-full">
            <BadgeCheckIcon className="size-3.5" /> Acte Signé & Officiel
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Info
          label="Enfant"
          value={`${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim() || "—"}
        />
        <Info
          label="Date de naissance"
          value={formatDate(birth.birthDate)}
        />
        <Info
          label="N° d’acte"
          value={birth.certificateNumber ?? "—"}
        />
        <Info
          label="Identifiant citoyen"
          value={birth.citizenAccessId ?? "—"}
        />
        <Info
          label="Hôpital déclarant"
          value={`${birth.hospital.name} · ${birth.hospital.city}`}
        />
        <Info
          label="Mairie d’origine"
          value={birth.cityHall ? `${birth.cityHall.name} · ${birth.cityHall.city}` : "—"}
        />
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/15 p-4 rounded-xl border border-border/50">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-sm text-foreground">{value}</p>
    </div>
  )
}
