"use client"

import { ClockIcon, AlertCircleIcon, FileClockIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatusTimeline, type TimelineStep } from "@/components/form/status-timeline"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface TimelineSectionProps {
  birth: {
    status: string
    birthDate: Date | null
    updatedAt: Date
    babyFirstName: string | null
    babyLastName: string | null
    hospital: {
      name: string
    }
  }
}

export function TimelineSection({ birth }: TimelineSectionProps) {
  const { status, birthDate, hospital } = birth

  // Determine header banner info based on status
  let statusTitle = "Dossier en cours de traitement"
  let statusColor = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
  let statusIcon = <ClockIcon className="size-5 shrink-0" />

  if (status === "DECLINED") {
    statusTitle = "Dossier renvoyé pour correction"
    statusColor = "bg-destructive/10 border-destructive/20 text-destructive"
    statusIcon = <AlertCircleIcon className="size-5 shrink-0" />
  }

  // Calculate timeline steps
  const steps: TimelineStep[] = [
    {
      label: "Déclaration de naissance reçue",
      description: `Enregistré par le médecin accoucheur au sein de l'établissement : ${hospital.name}`,
      date: birthDate ? formatDate(birthDate) : undefined,
      status: "done",
    },
    {
      label: "Traitement à la mairie",
      description:
        status === "DRAFT" || status === "SUBMITTED"
          ? "En attente de prise en charge par l'agent d'état civil"
          : status === "PROCESSING"
          ? "En cours d'examen et de saisie des informations complémentaires"
          : status === "DECLINED"
          ? "Dossier refusé par l'officier d'état civil et renvoyé à l'agent pour corrections"
          : "Dossier vérifié et finalisé par l'agent d'état civil",
      status:
        status === "DRAFT" || status === "SUBMITTED"
          ? "pending"
          : status === "PROCESSING"
          ? "active"
          : status === "DECLINED"
          ? "error"
          : "done",
    },
    {
      label: "Signature de l'Officier d'État Civil (Maire)",
      description:
        status === "APPROVED"
          ? "Acte validé et signé numériquement"
          : status === "PENDING_APPROVAL"
          ? "En attente de signature par le maire de la commune"
          : status === "DECLINED"
          ? "Signature bloquée (en cours de correction)"
          : "En attente de transmission",
      status: status === "APPROVED" ? "done" : status === "PENDING_APPROVAL" ? "active" : "pending",
    },
    {
      label: "Acte de naissance disponible",
      description: "Le certificat officiel d'acte de naissance est disponible pour retrait ou demande de transfert",
      status: status === "APPROVED" ? "done" : "pending",
    },
  ]

  return (
    <Card className="rounded-2xl border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <FileClockIcon className="size-5 text-primary" />
          Suivi de votre dossier en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold ${statusColor}`}>
          {statusIcon}
          <span>{statusTitle}</span>
        </div>
        
        <div className="bg-muted/10 p-5 rounded-2xl border border-border/50">
          <StatusTimeline steps={steps} />
        </div>
      </CardContent>
    </Card>
  )
}
