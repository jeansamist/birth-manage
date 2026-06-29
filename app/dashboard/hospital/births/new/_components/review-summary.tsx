"use client"

import { Edit3Icon, BabyIcon, UserIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BirthFormInput } from "@/lib/schemas/birth"

interface ReviewSummaryProps {
  values: BirthFormInput
  fatherUnknown: boolean
  onEditStep: (stepIndex: number) => void
}

export function ReviewSummary({ values, fatherUnknown, onEditStep }: ReviewSummaryProps) {
  const formatVal = (val?: string | number | null) => val || "Non renseigné"

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          🔍 Récapitulatif des données saisies (Vérification finale)
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard title="Enfant" icon={<BabyIcon className="size-3.5 text-primary" />} onEdit={() => onEditStep(0)}>
          <div className="space-y-1.5 text-xs">
            <p><span className="text-muted-foreground">Prénom :</span> <span className="font-medium">{formatVal(values.babyFirstName)}</span></p>
            <p><span className="text-muted-foreground">Nom :</span> <span className="font-medium">{formatVal(values.babyLastName)}</span></p>
            <p><span className="text-muted-foreground">Sexe :</span> <span className="font-medium">{values.babyGender === "MALE" ? "Masculin" : values.babyGender === "FEMALE" ? "Féminin" : "—"}</span></p>
            <p><span className="text-muted-foreground">Date/Heure :</span> <span className="font-medium">{formatVal(values.birthDate)} {values.birthTime ? `à ${values.birthTime}` : ""}</span></p>
            <p><span className="text-muted-foreground">Poids/Taille :</span> <span className="font-medium">{values.weightGrams ? `${values.weightGrams}g` : "—"} / {values.heightCm ? `${values.heightCm}cm` : "—"}</span></p>
          </div>
        </SummaryCard>

        <SummaryCard title="Mère" icon={<UserIcon className="size-3.5 text-primary" />} onEdit={() => onEditStep(1)}>
          <div className="space-y-1.5 text-xs">
            <p><span className="text-muted-foreground">Nom :</span> <span className="font-medium">{formatVal(values.motherFirstName)} {formatVal(values.motherLastName)}</span></p>
            <p><span className="text-muted-foreground">Nationalité :</span> <span className="font-medium">{formatVal(values.motherNationality)}</span></p>
            <p><span className="text-muted-foreground">CNI :</span> <span className="font-medium">{formatVal(values.motherCni)}</span></p>
            <p><span className="text-muted-foreground">Profession :</span> <span className="font-medium">{formatVal(values.motherProfession)}</span></p>
            <p><span className="text-muted-foreground">Téléphone :</span> <span className="font-medium">{formatVal(values.motherPhone)}</span></p>
          </div>
        </SummaryCard>

        <SummaryCard title="Père" icon={<UsersIcon className="size-3.5 text-primary" />} onEdit={() => onEditStep(2)}>
          {fatherUnknown ? (
            <p className="text-xs text-muted-foreground italic mt-4">Père non déclaré (Inconnu)</p>
          ) : (
            <div className="space-y-1.5 text-xs">
              <p><span className="text-muted-foreground">Nom :</span> <span className="font-medium">{formatVal(values.fatherFirstName)} {formatVal(values.fatherLastName)}</span></p>
              <p><span className="text-muted-foreground">Nationalité :</span> <span className="font-medium">{formatVal(values.fatherNationality)}</span></p>
              <p><span className="text-muted-foreground">CNI :</span> <span className="font-medium">{formatVal(values.fatherCni)}</span></p>
              <p><span className="text-muted-foreground">Profession :</span> <span className="font-medium">{formatVal(values.fatherProfession)}</span></p>
              <p><span className="text-muted-foreground">Téléphone :</span> <span className="font-medium">{formatVal(values.fatherPhone)}</span></p>
            </div>
          )}
        </SummaryCard>
      </div>
    </div>
  )
}

interface SummaryCardProps {
  title: string
  icon: React.ReactNode
  onEdit: () => void
  children: React.ReactNode
}

function SummaryCard({ title, icon, onEdit, children }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border p-4 bg-muted/10 relative flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            {icon} {title}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="size-7 hover:bg-muted cursor-pointer"
          >
            <Edit3Icon className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
