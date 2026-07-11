import * as React from "react"
import Link from "next/link"
import { SearchIcon, ClockIcon, ClipboardCheckIcon, ClipboardIcon, FileCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"

interface TrackPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const search = await searchParams
  const trackingCode = search.code?.trim().toUpperCase() ?? ""

  const birth = trackingCode
    ? await prisma.birthRecord.findFirst({
        where: {
          OR: [
            { citizenTrackingCode: trackingCode },
            { citizenAccessId: trackingCode },
          ],
        },
        include: {
          hospital: { select: { name: true, city: true } },
          cityHall: { select: { name: true, city: true } },
        },
      })
    : null

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
      <div className="max-w-2xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">
          Suivi de Dossier en Ligne / Track Request
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Saisissez votre code de suivi (ex. TRK-...) ou votre identifiant unique citoyen (CID-...) pour consulter l'avancement de votre déclaration de naissance.
        </p>

        {/* Tracking Search Form */}
        <form method="GET" className="flex gap-2 items-end bg-card border border-border p-4 rounded-md shadow-xs">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="code" className="text-[10px] font-bold text-foreground uppercase tracking-wider">
              Code de suivi / Identifiant citoyen
            </Label>
            <Input
              id="code"
              name="code"
              defaultValue={trackingCode}
              placeholder="Ex. TRK-2026-X8QP-A7"
              className="uppercase h-10 text-sm rounded-md"
              required
            />
          </div>
          <Button type="submit" className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground">
            <SearchIcon className="size-3.5 mr-1.5" />
            Rechercher
          </Button>
        </form>
      </div>

      {trackingCode && !birth && (
        <div className="border border-destructive/20 bg-destructive/5 p-4 rounded-md text-center text-xs font-semibold text-destructive">
          Aucun dossier trouvé pour le code de suivi indiqué. Veuillez vérifier l'exactitude de la saisie.
        </div>
      )}

      {birth && (
        <div className="bg-card border border-border p-6 rounded-md shadow-xs space-y-6">
          <div className="flex justify-between items-start border-b border-border/50 pb-4">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Dossier de déclaration</p>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mt-0.5">
                {birth.babyFirstName ? `${birth.babyFirstName} ${birth.babyLastName}` : "Enfant non nommé"}
              </h2>
            </div>
            <span className="text-[10px] font-bold font-mono bg-muted text-foreground px-2 py-0.5 rounded-sm">
              {birth.citizenTrackingCode || "Dossier Médical"}
            </span>
          </div>

          {/* Clean minimal timeline */}
          <div className="space-y-6">
            <TimelineStep
              title="1. Déclaration Médicale / Medical Declaration"
              description={`Enregistrée par le centre médical (${birth.hospital.name}, ${birth.hospital.city})`}
              status="completed"
            />
            
            <TimelineStep
              title="2. Saisie des informations civiles / Parent Completion"
              description={
                birth.isCompletedByCitizen || birth.status !== "DRAFT"
                  ? "Informations civiles fournies avec succès."
                  : "En attente des informations du parent déclarant."
              }
              status={
                birth.status !== "DRAFT" || birth.isCompletedByCitizen
                  ? "completed"
                  : "pending"
              }
            />

            <TimelineStep
              title="3. Complétion par l'état civil / Civil Registrar Processing"
              description={
                birth.status === "APPROVED" || birth.status === "PENDING_APPROVAL"
                  ? "Vérifié et complété par le secrétaire d'état civil."
                  : birth.status === "PROCESSING"
                  ? "En cours de vérification par l'officier civil."
                  : "En attente de traitement par la mairie d'origine."
              }
              status={
                ["APPROVED", "PENDING_APPROVAL"].includes(birth.status)
                  ? "completed"
                  : birth.status === "PROCESSING"
                  ? "active"
                  : "pending"
              }
            />

            <TimelineStep
              title="4. Approbation et Signature / Approval and Signature"
              description={
                birth.status === "APPROVED"
                  ? `Signé par l'Officier d'état civil de la ${birth.cityHall?.name || "Mairie"}`
                  : birth.status === "DECLINED"
                  ? `Rejeté : ${birth.declineReason || "Dossier incomplet"}`
                  : "En attente de signature par le Maire / l'Officier."
              }
              status={
                birth.status === "APPROVED"
                  ? "completed"
                  : birth.status === "DECLINED"
                  ? "failed"
                  : "pending"
              }
            />
          </div>

          {/* Action button if draft (medical saved only) */}
          {birth.status === "DRAFT" && !birth.isCompletedByCitizen && (
            <div className="border-t border-border/50 pt-6 flex justify-end">
              <Button asChild className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/citizen/declare?code=${birth.citizenTrackingCode}`}>
                  Finaliser ma déclaration citoyenne
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}

function TimelineStep({
  title,
  description,
  status,
}: {
  title: string
  description: string
  status: "completed" | "active" | "pending" | "failed"
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${
            status === "completed"
              ? "bg-primary border-primary text-white"
              : status === "active"
              ? "bg-card border-primary text-foreground"
              : status === "failed"
              ? "bg-destructive border-destructive text-white"
              : "bg-card border-border text-muted-foreground"
          }`}
        >
          {status === "completed" ? (
            <ClipboardCheckIcon className="size-3.5" />
          ) : status === "active" ? (
            <ClockIcon className="size-3.5" />
          ) : status === "failed" ? (
            <span className="text-[10px]">!</span>
          ) : (
            <ClipboardIcon className="size-3.5" />
          )}
        </div>
        <div className="w-0.5 bg-muted flex-1 my-1 min-h-[20px]" />
      </div>
      <div className="space-y-0.5 pb-2">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${
          status === "pending" ? "text-muted-foreground" : "text-foreground"
        }`}>
          {title}
        </h3>
        <p className="text-muted-foreground text-[11px] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
