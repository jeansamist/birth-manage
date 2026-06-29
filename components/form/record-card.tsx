"use client"

import { cn } from "@/lib/utils"
import {
  BabyIcon,
  UserIcon,
  UsersIcon,
  CalendarIcon,
  WeightIcon,
  LandmarkIcon,
  HeartPulseIcon,
  CheckCircleIcon,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface RecordCardField {
  icon: React.ElementType
  label: string
  value?: string | null
}

interface RecordCardProps {
  title: string
  emoji: string
  color: string // Tailwind bg color
  fields: RecordCardField[]
  className?: string
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RecordField({ icon: Icon, label, value }: RecordCardField) {
  const missing = !value
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </span>
        <p
          className={cn(
            "text-xs truncate font-medium",
            missing ? "text-amber-500 italic" : "text-foreground"
          )}
        >
          {value ?? "Non renseigné"}
        </p>
      </div>
    </div>
  )
}

// ─── RecordCard ───────────────────────────────────────────────────────────────

export function RecordCard({ title, emoji, color, fields, className }: RecordCardProps) {
  const missingCount = fields.filter((f) => !f.value).length
  const complete = missingCount === 0

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg text-sm",
              color
            )}
          >
            {emoji}
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        {complete ? (
          <CheckCircleIcon className="size-4 text-emerald-500" />
        ) : (
          <span className="text-[10px] font-medium text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
            {missingCount} manquant{missingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-2.5">
        {fields.map((field, i) => (
          <RecordField key={i} {...field} />
        ))}
      </div>
    </div>
  )
}

// ─── Preset builders ─────────────────────────────────────────────────────────

interface BirthRecord {
  babyFirstName?: string | null
  babyLastName?: string | null
  babyGender?: string | null
  birthDate?: Date | null
  weightGrams?: number | null
  heightCm?: number | null
  deliveryType?: string | null
  motherFirstName?: string | null
  motherLastName?: string | null
  motherNationality?: string | null
  motherCni?: string | null
  motherProfession?: string | null
  motherPhone?: string | null
  motherAddress?: string | null
  fatherFirstName?: string | null
  fatherLastName?: string | null
  fatherNationality?: string | null
  parentsMarried?: boolean | null
}

function fmt(date: Date | null | undefined) {
  if (!date) return undefined
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(date)
  )
}

function genderLabel(g?: string | null) {
  if (g === "MALE") return "Masculin"
  if (g === "FEMALE") return "Féminin"
  return undefined
}

function deliveryLabel(d?: string | null) {
  const map: Record<string, string> = {
    NATURAL: "Naturel",
    CAESAREAN: "Césarienne",
    FORCEPS: "Forceps",
    VACUUM: "Ventouse",
  }
  return d ? map[d] : undefined
}

export function BirthRecordCards({ birth }: { birth: BirthRecord }) {
  return (
    <div className="space-y-4">
      <RecordCard
        title="Enfant"
        emoji="👶"
        color="bg-violet-100 dark:bg-violet-900/30"
        fields={[
          {
            icon: UserIcon,
            label: "Nom complet",
            value:
              [birth.babyFirstName, birth.babyLastName]
                .filter(Boolean)
                .join(" ") || null,
          },
          { icon: HeartPulseIcon, label: "Sexe", value: genderLabel(birth.babyGender) },
          { icon: CalendarIcon, label: "Date de naissance", value: fmt(birth.birthDate) },
          {
            icon: WeightIcon,
            label: "Poids / Taille",
            value: birth.weightGrams
              ? `${birth.weightGrams}g${birth.heightCm ? ` · ${birth.heightCm}cm` : ""}`
              : null,
          },
          {
            icon: HeartPulseIcon,
            label: "Accouchement",
            value: deliveryLabel(birth.deliveryType),
          },
        ]}
      />

      <RecordCard
        title="Mère"
        emoji="👩"
        color="bg-rose-100 dark:bg-rose-900/30"
        fields={[
          {
            icon: UserIcon,
            label: "Nom complet",
            value:
              [birth.motherFirstName, birth.motherLastName]
                .filter(Boolean)
                .join(" ") || null,
          },
          { icon: LandmarkIcon, label: "Nationalité", value: birth.motherNationality },
          { icon: UserIcon, label: "CNI / Passeport", value: birth.motherCni },
          { icon: UsersIcon, label: "Profession", value: birth.motherProfession },
          { icon: UserIcon, label: "Téléphone", value: birth.motherPhone },
          { icon: UserIcon, label: "Adresse", value: birth.motherAddress },
        ]}
      />

      <RecordCard
        title="Père"
        emoji="👨"
        color="bg-blue-100 dark:bg-blue-900/30"
        fields={[
          {
            icon: UserIcon,
            label: "Nom complet",
            value:
              [birth.fatherFirstName, birth.fatherLastName]
                .filter(Boolean)
                .join(" ") || null,
          },
          { icon: LandmarkIcon, label: "Nationalité", value: birth.fatherNationality },
          {
            icon: HeartPulseIcon,
            label: "Situation matrimoniale",
            value: birth.parentsMarried === true
              ? "Parents mariés"
              : birth.parentsMarried === false
              ? "Parents non mariés"
              : null,
          },
        ]}
      />
    </div>
  )
}
