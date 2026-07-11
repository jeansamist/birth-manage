"use client"

import { DocumentPreview } from "@/components/form/document-preview"
import { PrintArea } from "@/components/print-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getBaseUrl } from "@/lib/utils"
import {
  BadgeCheckIcon,
  CalendarIcon,
  FingerprintIcon,
  HashIcon,
  HospitalIcon,
  LandmarkIcon,
  PrinterIcon,
  ShieldAlertIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react"
import { useState, type ComponentType } from "react"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(date)
  )
}

interface RecordDetailsProps {
  birth: any
}

export function RecordDetails({ birth }: RecordDetailsProps) {
  const [otpStep, setOtpStep] = useState<"none" | "sent" | "verified">("none")
  const [otpInput, setOtpInput] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [otpError, setOtpError] = useState("")
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Simulation d'envoi OTP
  function handleStartVerification() {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)
    setOtpError("")
    setOtpInput("")
    setOtpStep("sent")
  }

  function handleVerifyOtp() {
    if (otpInput === generatedCode) {
      setOtpStep("verified")
      setOtpError("")
    } else {
      setOtpError("Code de vérification incorrect. Veuillez réessayer.")
    }
  }

  const previewData = {
    babyFirstName: birth.babyFirstName,
    babyLastName: birth.babyLastName,
    babyGender: birth.babyGender,
    birthDate: birth.birthDate,
    birthTime: birth.birthTime,
    birthPlace:
      birth.birthPlace ||
      (birth.hospital
        ? `${birth.hospital.name}, ${birth.hospital.city}`
        : null),
    weightGrams: birth.weightGrams,
    heightCm: birth.heightCm,
    apgarScore: birth.apgarScore,
    deliveryType: birth.deliveryType,

    motherFirstName: birth.motherFirstName,
    motherLastName: birth.motherLastName,
    motherBirthDate: birth.motherBirthDate,
    motherNationality: birth.motherNationality || "Camerounaise",
    motherCni: birth.motherCni,
    motherProfession: birth.motherProfession,
    motherAddress: birth.motherAddress,
    motherPhone: birth.motherPhone,
    motherEmail: birth.motherEmail,

    fatherFirstName: birth.fatherFirstName,
    fatherLastName: birth.fatherLastName,
    fatherBirthDate: birth.fatherBirthDate,
    fatherNationality: birth.fatherNationality || "Camerounaise",
    fatherCni: birth.fatherCni,
    fatherProfession: birth.fatherProfession,
    fatherAddress: birth.fatherAddress,
    fatherPhone: birth.fatherPhone,

    parentsMarried: birth.parentsMarried,
    marriageCertNumber: birth.marriageCertNumber,
    marriageDate: birth.marriageDate,

    certificateNumber: birth.certificateNumber || "ACN-2026-LA-PENDING",
    cityHallName: birth.cityHall?.name || "Mairie de Yaoundé I",
    cityHallCity: birth.cityHall?.city || "Yaoundé",
    maireName: birth.maireName || "SIMON BIYA",
    secretaireName: birth.secretaireName || "MBUYI CECILE",
    qrCodeUrl: birth.citizenAccessId
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}`
      : null,
    declarationRef: birth.declarationRef,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  return (
    <>
      <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm print:hidden">
        <CardHeader className="gap-4 border-b border-border/60 bg-muted/20 pb-5">
          <CardTitle className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRoundIcon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Dossier d&apos;acte de naissance
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  Informations officielles enregistrées
                </p>
              </div>
            </div>
            <Badge className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold tracking-wide text-white uppercase hover:bg-emerald-600">
              <BadgeCheckIcon className="size-3.5" /> Acte signé & officiel
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              icon={UserRoundIcon}
              label="Enfant"
              value={
                `${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim() ||
                "—"
              }
            />
            <Info
              icon={CalendarIcon}
              label="Date de naissance"
              value={formatDate(birth.birthDate)}
            />
            <Info
              icon={HashIcon}
              label="N° d'acte"
              value={birth.certificateNumber ?? "—"}
            />
            <Info
              icon={FingerprintIcon}
              label="Identifiant citoyen (CID)"
              value={birth.citizenAccessId ?? "—"}
            />
            <Info
              icon={HospitalIcon}
              label="Hôpital déclarant"
              value={
                birth.hospital
                  ? `${birth.hospital.name} · ${birth.hospital.city}`
                  : "—"
              }
            />
            <Info
              icon={LandmarkIcon}
              label="Mairie d'origine"
              value={
                birth.cityHall
                  ? `${birth.cityHall.name} · ${birth.cityHall.city}`
                  : "—"
              }
            />
          </div>

          {/* Secure Verification Flow UI */}
          {/* {otpStep === "none" && (
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LockIcon className="size-4" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Pour protéger vos données, le téléchargement ou l&apos;impression
                  de l&apos;acte officiel requiert une vérification par code de
                  sécurité (OTP) à 6 chiffres envoyé aux coordonnées de la mère.
                </p>
              </div>
              <Button onClick={handleStartVerification} className="h-11 w-full gap-2 rounded-xl text-sm font-semibold sm:w-auto">
                <LockIcon className="size-4" />
                Démarrer la vérification sécurisée
              </Button>
            </div>
          )} */}

          {otpStep === "sent" && (
            <div className="space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlertIcon className="mt-0.5 size-4.5 shrink-0 text-amber-500" />
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                    Mode simulation / test
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Un code de sécurité a été envoyé par SMS au{" "}
                    <span className="font-semibold text-foreground">
                      {birth.motherPhone
                        ? `+237 ${birth.motherPhone}`
                        : "téléphone de la mère"}
                    </span>
                    .
                  </p>
                  <p className="inline-block rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                    Code de test : {generatedCode}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="otpCode"
                  className="text-xs font-semibold text-muted-foreground uppercase"
                >
                  Code OTP à 6 chiffres
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) =>
                      setOtpInput(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="123456"
                    className="h-11 w-32 rounded-xl bg-background text-center text-base font-bold tracking-widest"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    className="h-11 rounded-xl px-5 text-sm font-semibold"
                  >
                    Vérifier
                  </Button>
                </div>
                {otpError && (
                  <p className="mt-1 text-xs font-semibold text-destructive">
                    {otpError}
                  </p>
                )}
              </div>
            </div>
          )}

          {otpStep === "verified" && (
            <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <BadgeCheckIcon className="size-4.5" /> Authentification réussie
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowPreviewModal(true)}
                  className="h-11 gap-2 rounded-xl text-sm font-semibold"
                >
                  <PrinterIcon className="size-4" />
                  Imprimer / Afficher l&apos;acte
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOtpStep("none")}
                  className="h-11 rounded-xl px-4 text-sm font-semibold"
                >
                  Verrouiller
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Printable Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 print:absolute print:inset-0 print:bg-white print:p-0">
          <div className="my-8 flex w-full max-w-[840px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl print:my-0 print:rounded-none print:shadow-none">
            {/* Modal header (hidden when printing) */}
            <div className="flex items-center justify-between bg-foreground px-6 py-4 text-white print:hidden">
              <div className="flex items-center gap-2">
                <PrinterIcon className="size-4 text-muted-foreground" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Aperçu officiel de l&apos;acte de naissance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.print()}
                  className="h-9 rounded-lg bg-card px-4 text-xs font-bold tracking-wider text-foreground uppercase hover:bg-muted/50"
                >
                  <PrinterIcon className="mr-1 size-3.5" />
                  Imprimer
                </Button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
            </div>

            {/* Document display */}
            <div className="flex justify-center overflow-y-auto bg-muted p-6 md:p-12 print:hidden">
              <div className="w-full max-w-[760px]">
                <DocumentPreview type="certificate" data={previewData} />
              </div>
            </div>
          </div>

          {/* Copie dédiée à l'impression, portée directement sous <body> pour
              échapper au layout citoyen (ruban fixe, watermark, header fixe...)
              qui empêchait le rendu papier de s'afficher correctement. */}
          <PrintArea>
            <DocumentPreview type="certificate" data={previewData} />
          </PrintArea>
        </div>
      )}
    </>
  )
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/15 p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
