import * as React from "react"
import Link from "next/link"
import { ShieldCheckIcon, ShieldAlertIcon, FileTextIcon, ArrowLeftIcon } from "lucide-react"
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

  const birth = await prisma.birthRecord.findUnique({
    where: { citizenAccessId: token },
    include: {
      hospital: { select: { name: true, city: true } },
      cityHall: { select: { name: true, city: true } },
    },
  })

  const isAuthentic = birth && birth.status === "APPROVED"

  return (
    <main className="min-h-screen bg-neutral-50/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-neutral-200 rounded-md shadow-lg overflow-hidden font-sans">
        
        {/* Verification Status Header */}
        {isAuthentic ? (
          <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
            <ShieldCheckIcon className="size-12 mx-auto animate-pulse" />
            <h1 className="text-sm font-bold uppercase tracking-wider">
              Acte de Naissance Authentique
            </h1>
            <p className="text-[10px] text-emerald-100 uppercase tracking-widest font-semibold">
              Authentic Birth Certificate
            </p>
          </div>
        ) : (
          <div className="bg-destructive text-white p-6 text-center space-y-2">
            <ShieldAlertIcon className="size-12 mx-auto" />
            <h1 className="text-sm font-bold uppercase tracking-wider">
              Document Non Authentifié
            </h1>
            <p className="text-[10px] text-destructive-foreground uppercase tracking-widest font-semibold">
              Unverified Document
            </p>
          </div>
        )}

        <div className="p-6 space-y-6">
          {isAuthentic ? (
            <>
              <p className="text-xs text-neutral-500 leading-relaxed text-center">
                Ce document est certifié cryptographiquement par le Registre National de l'État Civil (BUNEC). Les informations ci-dessous doivent correspondre exactement aux mentions portées sur le document papier présenté.
              </p>

              {/* Data comparison grid */}
              <div className="border border-neutral-100 rounded-md divide-y divide-neutral-100 text-xs">
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
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-xs text-neutral-500 leading-relaxed">
                Aucun acte approuvé et authentifié ne correspond à la signature ou à la référence fournie (<code className="bg-neutral-100 px-1 py-0.5 rounded-sm text-neutral-800 font-mono text-[10px]">{token}</code>).
              </p>
              <p className="text-[10px] text-neutral-400">
                Si ce document papier a été récemment délivré, veuillez patienter le temps de sa synchronisation ou contacter la mairie d'origine.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="border-t border-neutral-100 pt-6 flex justify-center">
            <Button asChild variant="outline" className="h-9 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer border-neutral-300">
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
    <div className="grid grid-cols-3 p-3 gap-2">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider col-span-1">{label}</span>
      <span className={`font-semibold text-neutral-800 col-span-2 ${isUpper ? "uppercase" : ""}`}>
        {value || "—"}
      </span>
    </div>
  )
}
