import * as React from "react"
import Link from "next/link"
import { 
  ShieldCheckIcon, 
  ShieldAlertIcon, 
  FileTextIcon, 
  ArrowLeftIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  Edit3Icon,
  CheckCircle2Icon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

interface VerifyPageProps {
  params: Promise<{ token: string }>
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const resolvedParams = await params
  const token = resolvedParams.token

  const birth = await prisma.birthRecord.findFirst({
    where: {
      OR: [
        { citizenAccessId: token },
        { citizenTrackingCode: token },
      ],
    },
    include: {
      hospital: { select: { name: true, city: true } },
      cityHall: { select: { name: true, city: true } },
    },
  })

  // Configuration dynamique de l'entête selon le statut
  let headerBg = "bg-destructive text-white"
  let headerTitle = "Document Non Authentifié"
  let headerSubtitle = "Unverified Document"
  let headerIcon = <ShieldAlertIcon className="size-12 mx-auto" />

  if (birth) {
    if (birth.status === "APPROVED") {
      headerBg = "bg-emerald-600 text-white"
      headerTitle = "Acte de Naissance Authentique"
      headerSubtitle = "Authentic Birth Certificate"
      headerIcon = <ShieldCheckIcon className="size-12 mx-auto" />
    } else if (birth.status === "DRAFT") {
      headerBg = "bg-amber-600 text-white"
      headerTitle = "Déclaration Médicale Enregistrée"
      headerSubtitle = "Medical Birth Declaration Received"
      headerIcon = <FileTextIcon className="size-12 mx-auto" />
    } else if (birth.status === "DECLINED") {
      headerBg = "bg-rose-700 text-white"
      headerTitle = "Déclaration Refusée / À corriger"
      headerSubtitle = "Declaration Declined / Needs Correction"
      headerIcon = <AlertCircleIcon className="size-12 mx-auto" />
    } else {
      headerBg = "bg-blue-600 text-white"
      headerTitle = "Déclaration en cours d'instruction"
      headerSubtitle = "Declaration Processing at Town Hall"
      headerIcon = <ClockIcon className="size-12 mx-auto" />
    }
  }

  return (
    <main className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-md shadow-lg overflow-hidden font-sans">
        
        {/* Verification Status Header */}
        <div className={`${headerBg} p-6 text-center space-y-2`}>
          {headerIcon}
          <h1 className="text-sm font-bold uppercase tracking-wider">{headerTitle}</h1>
          <p className="text-[10px] opacity-90 uppercase tracking-widest font-semibold">{headerSubtitle}</p>
        </div>

        <div className="p-6 space-y-6">
          {birth ? (
            <>
              {/* Cas 1: Acte Approuvé & Authentique */}
              {birth.status === "APPROVED" && (
                <>
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">
                    Ce document est certifié cryptographiquement par le Registre National de l'État Civil (BUNEC). Les informations ci-dessous doivent correspondre exactement aux mentions portées sur le document papier présenté.
                  </p>

                  <div className="border border-border/50 rounded-md divide-y divide-border/50 text-xs">
                    <VerifyRow label="N° Acte / Certificate No." value={birth.certificateNumber} />
                    <VerifyRow label="Nom de l'enfant / Surname" value={birth.babyLastName} isUpper />
                    <VerifyRow label="Prénoms de l'enfant / Given Name" value={birth.babyFirstName} isUpper />
                    <VerifyRow label="Sexe / Sex" value={birth.babyGender === "MALE" ? "MASCULIN / MALE" : "FÉMININ / FEMALE"} />
                    <VerifyRow label="Date de naissance / Date of birth" value={formatDate(birth.birthDate)} />
                    <VerifyRow label="Lieu de naissance / Place of birth" value={birth.birthPlace} isUpper />
                    <VerifyRow label="Mère / Mother" value={`${birth.motherFirstName ?? ""} ${birth.motherLastName ?? ""}`} isUpper />
                    <VerifyRow label="Père / Father" value={birth.fatherFirstName ? `${birth.fatherFirstName} ${birth.fatherLastName ?? ""}` : "—"} isUpper />
                    <VerifyRow label="Mairie d'enregistrement / City Hall" value={birth.cityHall ? `${birth.cityHall.name} · ${birth.cityHall.city}` : "—"} isUpper />
                    <VerifyRow label="Date de signature / Approved date" value={formatDate(birth.approvedAt)} />
                  </div>
                </>
              )}

              {/* Cas 2: Brouillon médical (attente complétion citoyenne) */}
              {birth.status === "DRAFT" && (
                <div className="space-y-5">
                  <div className="border border-amber-200 bg-amber-50/50 p-5 rounded-md space-y-4">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Action requise :</strong> Les informations médicales ont été saisies par le centre de santé ({birth.hospital.name}). Pour finaliser l'établissement de l'acte de naissance de l'enfant, un parent doit déclarer les prénoms de l'enfant et les informations du père.
                    </p>
                    <Button asChild className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all duration-300">
                      <Link href={`/citizen/declare?code=${birth.citizenTrackingCode}`}>
                        <Edit3Icon className="size-4" />
                        Compléter ma déclaration en ligne
                      </Link>
                    </Button>
                  </div>

                  <div className="border border-border/50 rounded-md divide-y divide-border/50 text-xs">
                    <VerifyRow label="Code de Suivi / Tracking Code" value={birth.citizenTrackingCode} />
                    <VerifyRow label="Maternité / Hospital" value={birth.hospital.name} isUpper />
                    <VerifyRow label="Date de naissance / Birth Date" value={formatDate(birth.birthDate)} />
                    <VerifyRow label="Sexe de l'enfant / Gender" value={birth.babyGender === "MALE" ? "MASCULIN" : "FÉMININ"} />
                    <VerifyRow label="Mère / Mother" value={`${birth.motherFirstName ?? ""} ${birth.motherLastName ?? ""}`} isUpper />
                  </div>
                </div>
              )}

              {/* Cas 3: Refusé par la mairie (attente correction) */}
              {birth.status === "DECLINED" && (
                <div className="space-y-5">
                  <div className="border border-rose-200 bg-rose-50/50 p-5 rounded-md space-y-3">
                    <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Motif de renvoi / Correction Reason :</h3>
                    <p className="text-xs font-semibold text-rose-700 bg-card p-3 border border-rose-100 rounded leading-relaxed">
                      {birth.declineReason || "Aucun motif spécifié. Veuillez vous rapprocher de la mairie d'enregistrement."}
                    </p>
                    <p className="text-[10px] text-rose-500 leading-relaxed">
                      Le dossier a été renvoyé par la mairie ({birth.cityHall?.name || "Mairie d'enregistrement"}) pour motif de correction. Veuillez contacter le médecin déclarant ou la mairie pour mettre à jour les informations.
                    </p>
                  </div>

                  <div className="border border-border/50 rounded-md divide-y divide-border/50 text-xs">
                    <VerifyRow label="Code de Suivi / Tracking Code" value={birth.citizenTrackingCode} />
                    <VerifyRow label="Centre d'état civil / City Hall" value={birth.cityHall?.name} isUpper />
                    <VerifyRow label="Nom de l'enfant / Surname" value={birth.babyLastName} isUpper />
                    <VerifyRow label="Mère / Mother" value={`${birth.motherFirstName ?? ""} ${birth.motherLastName ?? ""}`} isUpper />
                  </div>
                </div>
              )}

              {/* Cas 4: Soumis et en cours d'instruction en Mairie */}
              {["SUBMITTED", "PROCESSING", "PENDING_APPROVAL"].includes(birth.status) && (
                <div className="space-y-6">
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">
                    La déclaration de naissance a été complétée et est en cours d'instruction à la mairie compétente.
                  </p>

                  {/* Timeline visuelle simple et élégante */}
                  <div className="bg-muted/50 p-5 border border-border/50 rounded-md space-y-5">
                    <TimelineStep 
                      title="1. Déclaration médicale en maternité" 
                      subtitle={`Effectuée par le centre hospitalier (${birth.hospital.name})`}
                      isDone={true} 
                    />
                    <TimelineStep 
                      title="2. Finalisation par les parents" 
                      subtitle="Informations civiles soumises avec succès en ligne"
                      isDone={birth.isCompletedByCitizen || birth.status !== "SUBMITTED"} 
                    />
                    <TimelineStep 
                      title="3. Instruction à l'état civil" 
                      subtitle={birth.status === "PENDING_APPROVAL" ? "Dossier vérifié et soumis au Maire" : "Vérification des pièces justificatives par le secrétaire d'état civil"}
                      isDone={birth.status === "PENDING_APPROVAL"}
                      isActive={["SUBMITTED", "PROCESSING"].includes(birth.status)}
                    />
                    <TimelineStep 
                      title="4. Approbation et signature de l'acte" 
                      subtitle="Attente de signature numérique cryptographique de l'Officier"
                      isDone={false}
                      isActive={birth.status === "PENDING_APPROVAL"}
                    />
                  </div>

                  <div className="border border-border/50 rounded-md divide-y divide-border/50 text-xs">
                    <VerifyRow label="Code de Suivi / Tracking Code" value={birth.citizenTrackingCode} />
                    <VerifyRow label="Mairie d'enregistrement / City Hall" value={birth.cityHall?.name} isUpper />
                    <VerifyRow label="Enfant / Child" value={`${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`} isUpper />
                    <VerifyRow label="Mère / Mother" value={`${birth.motherFirstName ?? ""} ${birth.motherLastName ?? ""}`} isUpper />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aucune déclaration ou aucun acte approuvé ne correspond au code ou à l'identifiant fourni (<code className="bg-muted px-1.5 py-0.5 rounded-sm text-foreground font-mono text-[10px] font-bold">{token}</code>).
              </p>
              <p className="text-[10px] text-muted-foreground">
                Si ce document papier a été récemment établi, veuillez patienter le temps de sa synchronisation sur le registre national ou contacter l'administration concernée.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="border-t border-border/50 pt-6 flex justify-center">
            <Button asChild variant="outline" className="h-9 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer border-border">
              <Link href="/citizen">
                <ArrowLeftIcon className="size-3.5 mr-1.5" />
                Retour au portail citoyen
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

function VerifyRow({ label, value, isUpper = false }: { label: string; value: string | null | undefined; isUpper?: boolean }) {
  return (
    <div className="grid grid-cols-3 p-3 gap-2 text-left">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider col-span-1">{label}</span>
      <span className={`font-semibold text-foreground col-span-2 ${isUpper ? "uppercase" : ""}`}>
        {value || "—"}
      </span>
    </div>
  )
}

function TimelineStep({ title, subtitle, isDone, isActive = false }: { title: string; subtitle: string; isDone: boolean; isActive?: boolean }) {
  return (
    <div className="flex gap-3 text-left">
      <div className="flex flex-col items-center">
        <div className={`size-5 rounded-full flex items-center justify-center border text-[9px] font-bold shrink-0 ${
          isDone 
            ? "bg-emerald-600 border-emerald-600 text-white" 
            : isActive 
            ? "bg-blue-600 border-blue-600 text-white" 
            : "bg-card border-border text-muted-foreground"
        }`}>
          {isDone ? "✓" : isActive ? "•" : " "}
        </div>
        <div className="w-0.5 bg-muted flex-1 my-1 min-h-[15px]" />
      </div>
      <div className="space-y-0.5 pb-2">
        <h4 className={`text-[10px] font-bold uppercase tracking-wider ${
          isDone ? "text-emerald-700" : isActive ? "text-blue-700" : "text-muted-foreground"
        }`}>
          {title}
        </h4>
        <p className="text-muted-foreground text-[9px] leading-relaxed">{subtitle}</p>
      </div>
    </div>
  )
}
