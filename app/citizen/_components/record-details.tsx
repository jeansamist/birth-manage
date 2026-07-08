"use client"

import { useState } from "react"
import { BadgeCheckIcon, DownloadIcon, PrinterIcon, XIcon, ShieldAlertIcon, LockIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DocumentPreview } from "@/components/form/document-preview"
import { cn, getBaseUrl } from "@/lib/utils"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
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
    birthPlace: birth.birthPlace || (birth.hospital ? `${birth.hospital.name}, ${birth.hospital.city}` : null),
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
    qrCodeUrl: birth.citizenAccessId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}` : null,
    declarationRef: birth.declarationRef,
    citizenTrackingCode: birth.citizenTrackingCode,
  }

  return (
    <>
      <Card className="rounded-md border border-border overflow-hidden bg-card shadow-xs print:hidden">
        <CardHeader className="pb-4 border-b border-border bg-neutral-50/50">
          <CardTitle className="flex items-center justify-between gap-3 text-sm font-bold uppercase tracking-wider text-neutral-800">
            Dossier d'Acte de Naissance
            <Badge className="bg-green-700 text-white font-semibold flex items-center gap-1 py-1 px-2.5 rounded-sm uppercase text-[9px] tracking-wider">
              <BadgeCheckIcon className="size-3.5" /> Acte Signé & Officiel
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info
              label="Enfant / Child"
              value={`${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim() || "—"}
            />
            <Info
              label="Date de naissance / Date of birth"
              value={formatDate(birth.birthDate)}
            />
            <Info
              label="N° d’acte / Certificate No."
              value={birth.certificateNumber ?? "—"}
            />
            <Info
              label="Identifiant citoyen / CID"
              value={birth.citizenAccessId ?? "—"}
            />
            <Info
              label="Hôpital déclarant / Hospital"
              value={birth.hospital ? `${birth.hospital.name} · ${birth.hospital.city}` : "—"}
            />
            <Info
              label="Mairie d’origine / City Hall"
              value={birth.cityHall ? `${birth.cityHall.name} · ${birth.cityHall.city}` : "—"}
            />
          </div>

          <Separator className="border-border" />

          {/* Secure Verification Flow UI */}
          {otpStep === "none" && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Pour des raisons de confidentialité Zero-Trust, le téléchargement ou l'impression de l'acte officiel requiert une authentification contextuelle par code de sécurité OTP à 6 chiffres envoyé aux coordonnées de la mère.
              </p>
              <Button
                onClick={handleStartVerification}
                className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-900 text-white cursor-pointer flex items-center justify-center gap-2"
              >
                <LockIcon className="size-3.5" />
                Démarrer la vérification sécurisée / Unlock download
              </Button>
            </div>
          )}

          {otpStep === "sent" && (
            <div className="space-y-4 border border-neutral-200 bg-neutral-50/50 p-4 rounded-md">
              <div className="flex items-start gap-2 text-amber-700 text-xs font-semibold">
                <ShieldAlertIcon className="size-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="uppercase text-[9px] tracking-wider">Simulé / Test Mode</p>
                  <p className="text-[10px] text-neutral-500 font-normal mt-0.5">
                    Un code de sécurité OTP a été envoyé par SMS au <span className="font-semibold">{birth.motherPhone ? `+237 ${birth.motherPhone}` : "téléphone de la mère"}</span>.
                  </p>
                  <p className="text-[10px] text-amber-800 font-bold mt-1 bg-amber-500/10 inline-block px-2 py-0.5 rounded-sm">
                    CODE DE TEST OTP : {generatedCode}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otpCode" className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
                  Code OTP à 6 chiffres
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="h-10 text-center tracking-widest text-base font-bold rounded-md bg-white border-neutral-300 w-32"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-900 text-white cursor-pointer"
                  >
                    Vérifier
                  </Button>
                </div>
                {otpError && <p className="text-[10px] text-destructive font-semibold mt-1">{otpError}</p>}
              </div>
            </div>
          )}

          {otpStep === "verified" && (
            <div className="space-y-4 border border-green-200 bg-green-500/5 p-4 rounded-md">
              <p className="text-[10px] text-green-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BadgeCheckIcon className="size-4 text-green-600" /> Authentification réussie / Identity Verified
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPreviewModal(true)}
                  className="h-10 px-5 rounded-md text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-900 text-white cursor-pointer flex items-center gap-1.5"
                >
                  <PrinterIcon className="size-3.5" />
                  Imprimer / Afficher l'acte
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOtpStep("none")}
                  className="h-10 px-4 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer border-neutral-300"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto print:absolute print:inset-0 print:bg-white print:p-0">
          <div className="bg-white w-full max-w-[840px] rounded-md shadow-2xl overflow-hidden flex flex-col my-8 print:my-0 print:shadow-none print:rounded-none">
            {/* Modal header (hidden when printing) */}
            <div className="px-6 py-4 bg-neutral-800 text-white flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <PrinterIcon className="size-4 text-neutral-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Aperçu officiel de l'Acte de Naissance</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.print()}
                  className="h-8.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-md"
                >
                  <PrinterIcon className="size-3.5 mr-1" />
                  Imprimer / Print
                </Button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
            </div>

            {/* Document display */}
            <div className="p-6 md:p-12 overflow-y-auto flex justify-center bg-neutral-100 print:bg-white print:p-0">
              <div className="w-full max-w-[760px] print:max-w-none">
                <DocumentPreview type="certificate" data={previewData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/15 p-4 rounded-md border border-border/50">
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 font-bold text-sm text-neutral-800">{value}</p>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-neutral-200", className)} />
}
