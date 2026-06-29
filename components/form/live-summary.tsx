"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  BabyIcon,
  UserIcon,
  UsersIcon,
  LandmarkIcon,
  CalendarIcon,
  WeightIcon,
  HeartIcon,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BabySummary {
  firstName?: string
  lastName?: string
  gender?: "MALE" | "FEMALE"
  birthDate?: string
  weightGrams?: number | string
}

interface ParentSummary {
  firstName?: string
  lastName?: string
  nationality?: string
  profession?: string
}

interface LiveSummaryProps {
  baby?: BabySummary
  mother?: ParentSummary
  father?: ParentSummary
  cityHallName?: string
  currentStep: number
  className?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </p>
        <p
          className={cn(
            "text-xs font-medium truncate",
            value ? "text-foreground" : "text-muted-foreground/50 italic"
          )}
        >
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  )
}

function SummarySection({
  title,
  icon: Icon,
  color,
  children,
  faded,
}: {
  title: string
  icon: React.ElementType
  color: string
  children: React.ReactNode
  faded?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: faded ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className={cn("flex size-6 items-center justify-center rounded-md", color)}>
          <Icon className="size-3.5 text-white" />
        </div>
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-2.5 pl-8">{children}</div>
    </motion.div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LiveSummary({
  baby,
  mother,
  father,
  cityHallName,
  currentStep,
  className,
}: LiveSummaryProps) {
  const babyName =
    [baby?.firstName, baby?.lastName].filter(Boolean).join(" ") || undefined

  const genderLabel =
    baby?.gender === "MALE"
      ? "Masculin"
      : baby?.gender === "FEMALE"
      ? "Féminin"
      : undefined

  const motherName =
    [mother?.firstName, mother?.lastName].filter(Boolean).join(" ") || undefined

  const fatherName =
    [father?.firstName, father?.lastName].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-5", className)}>
      {/* Enfant */}
      <SummarySection
        title="Enfant"
        icon={BabyIcon}
        color="bg-violet-500"
        faded={currentStep < 0}
      >
        <SummaryRow icon={UserIcon} label="Nom complet" value={babyName} />
        <SummaryRow icon={HeartIcon} label="Sexe" value={genderLabel} />
        <SummaryRow
          icon={CalendarIcon}
          label="Date de naissance"
          value={
            baby?.birthDate
              ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                  new Date(baby.birthDate)
                )
              : undefined
          }
        />
        {baby?.weightGrams && (
          <SummaryRow
            icon={WeightIcon}
            label="Poids"
            value={`${baby.weightGrams} g`}
          />
        )}
      </SummarySection>

      {/* Mère */}
      <SummarySection
        title="Mère"
        icon={UserIcon}
        color="bg-rose-500"
        faded={currentStep < 1}
      >
        <SummaryRow icon={UserIcon} label="Nom complet" value={motherName} />
        <SummaryRow
          icon={LandmarkIcon}
          label="Nationalité"
          value={mother?.nationality}
        />
        <SummaryRow
          icon={UsersIcon}
          label="Profession"
          value={mother?.profession}
        />
      </SummarySection>

      {/* Père */}
      <SummarySection
        title="Père"
        icon={UsersIcon}
        color="bg-blue-500"
        faded={currentStep < 2}
      >
        <SummaryRow icon={UserIcon} label="Nom complet" value={fatherName} />
        <SummaryRow
          icon={LandmarkIcon}
          label="Nationalité"
          value={father?.nationality}
        />
      </SummarySection>

      {/* Mairie */}
      <SummarySection
        title="Mairie de destination"
        icon={LandmarkIcon}
        color="bg-emerald-500"
        faded={currentStep < 3}
      >
        <SummaryRow
          icon={LandmarkIcon}
          label="Mairie"
          value={cityHallName}
        />
      </SummarySection>
    </div>
  )
}
