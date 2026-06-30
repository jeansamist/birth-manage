"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ShieldAlert } from "lucide-react"

// Types pour le composant de prévisualisation
export interface PreviewData {
  // Enfant
  babyFirstName?: string | null
  babyLastName?: string | null
  babyGender?: "MALE" | "FEMALE" | null
  birthDate?: string | Date | null
  birthTime?: string | null
  birthPlace?: string | null
  weightGrams?: number | string | null
  heightCm?: number | string | null
  apgarScore?: number | string | null
  deliveryType?: string | null
  
  // Mère
  motherFirstName?: string | null
  motherLastName?: string | null
  motherBirthDate?: string | Date | null
  motherNationality?: string | null
  motherCni?: string | null
  motherProfession?: string | null
  motherAddress?: string | null
  motherPhone?: string | null
  motherEmail?: string | null
  
  // Père
  fatherFirstName?: string | null
  fatherLastName?: string | null
  fatherBirthDate?: string | Date | null
  fatherNationality?: string | null
  fatherCni?: string | null
  fatherProfession?: string | null
  fatherAddress?: string | null
  fatherPhone?: string | null
  
  // Mariage & Déclarant
  parentsMarried?: boolean | null
  marriageCertNumber?: string | null
  marriageDate?: string | Date | null
  declarantFirstName?: string | null
  declarantLastName?: string | null
  declarantPhone?: string | null
  declarantCni?: string | null
  declarantRole?: string | null

  // Métadonnées Mairie / Établissement
  declarationRef?: string | null
  certificateNumber?: string | null
  cityHallName?: string | null
  cityHallCity?: string | null
  hospitalName?: string | null
  approvedAt?: string | Date | null
  maireName?: string | null
  secretaireName?: string | null
  qrCodeUrl?: string | null
}

interface DocumentPreviewProps {
  type: "declaration" | "certificate"
  data: PreviewData
  className?: string
}

// Formate une date en format lisible JJ/MM/AAAA ou Texte
function formatDate(dateStr?: string | Date | null, verbose = false) {
  if (!dateStr) return ".........................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".........................................."
  
  if (verbose) {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)
  }
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function DocumentPreview({ type, data, className }: DocumentPreviewProps) {
  const isDecl = type === "declaration"
  
  // Noms complets ou pointillés
  const babyFullName = [data.babyFirstName, data.babyLastName].filter(Boolean).join(" ") || ""
  const motherFullName = [data.motherFirstName, data.motherLastName].filter(Boolean).join(" ") || ""
  const fatherFullName = [data.fatherFirstName, data.fatherLastName].filter(Boolean).join(" ") || ""
  const declarantFullName = [data.declarantFirstName, data.declarantLastName].filter(Boolean).join(" ") || ""

  return (
    <div className={cn("w-full flex items-center justify-center p-2", className)}>
      <div 
        className={cn(
          "w-full aspect-[1/1.414] bg-white text-black p-6 md:p-8 flex flex-col relative overflow-hidden shadow-2xl select-none text-[10px] border border-neutral-300 rounded-sm font-sans"
        )}
        style={{ color: "#000000" }}
      >
        {/* Armoiries et watermark en arrière-plan pour l'acte officiel */}
        {!isDecl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
            <div className="relative w-80 h-80">
              <Image 
                src="/cameroon-logo.png" 
                alt="Armoiries du Cameroun" 
                fill 
                className="object-contain"
                priority 
              />
            </div>
            <div className="absolute rotate-[33deg] text-[40px] font-black tracking-widest text-neutral-800 whitespace-nowrap opacity-[0.4] select-none">
              PAIX TRAVAIL PATRIE · PEACE WORK FATHERLAND
            </div>
          </div>
        )}

        {/* ─── EN-TÊTE COMMUN (BILINGUE CAMEROUN) ─── */}
        <div className="flex justify-between items-start border-b pb-2 mb-4 border-neutral-200">
          <div className="text-center w-[40%] flex flex-col items-center">
            <span className="font-bold text-[9px] uppercase tracking-wider">République du Cameroun</span>
            <span className="text-[7px] text-neutral-500 italic leading-none mt-0.5">Republic of Cameroon</span>
            <span className="font-medium text-[8px] mt-1">Paix - Travail - Patrie</span>
            <span className="text-[6px] text-neutral-500 italic leading-none">Peace - Work - Fatherland</span>
            <div className="mt-2 text-left w-full text-[7px] space-y-0.5 text-neutral-600">
              <div>Région : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "Centre" : "...................."}</span></div>
              <div>Département : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "Mfoundi" : "...................."}</span></div>
            </div>
          </div>

          <div className="relative w-10 h-10 mx-2 shrink-0">
            <Image 
              src="/cameroon-logo.png" 
              alt="Logo Cameroun" 
              fill 
              className="object-contain" 
            />
          </div>

          <div className="text-center w-[40%] flex flex-col items-center">
            <span className="font-bold text-[9px] uppercase tracking-wider">République du Cameroun</span>
            <span className="text-[7px] text-neutral-500 italic leading-none mt-0.5">Republic of Cameroon</span>
            <span className="font-medium text-[8px] mt-1">Paix - Travail - Patrie</span>
            <span className="text-[6px] text-neutral-500 italic leading-none">Peace - Work - Fatherland</span>
            <div className="mt-2 text-left w-full text-[7px] space-y-0.5 text-neutral-600">
              <div>Arrondissement : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "Yaoundé I" : "...................."}</span></div>
              <div>Ville/Commune : <span className="font-semibold text-black uppercase">{data.cityHallCity || "...................."}</span></div>
            </div>
          </div>
        </div>

        {/* ─── RENDU DU DOCUMENT 1 : DÉCLARATION DE NAISSANCE ─── */}
        {isDecl ? (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mb-3">
              <div className="border-2 border-black inline-block px-4 py-1.5 rounded-sm">
                <h1 className="font-bold text-sm tracking-wide uppercase">
                  Déclaration de Naissance / Birth Declaration
                </h1>
                <p className="text-[7px] text-neutral-500 italic leading-none mt-0.5">
                  Bien vouloir lire attentivement les instructions avant de remplir le formulaire
                </p>
              </div>
              <div className="text-right mt-1.5 font-bold text-xs text-neutral-800">
                N° : <span className="underline font-mono">{data.declarationRef || "..............................."}</span>
              </div>
            </div>

            {/* SECTION 1 : ENFANT */}
            <div className="border border-black rounded-sm mb-2 overflow-hidden">
              <h2 className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Section 1 : Renseignements sur l'enfant / Child's information
              </h2>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="col-span-2 flex gap-1">
                  <span className="text-neutral-500">Nom Complet / Full Name :</span>
                  <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
                    {babyFullName || "......................................................................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Né le / Born on :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {formatDate(data.birthDate)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Lieu / Place :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
                    {data.birthPlace || data.hospitalName || "........................................"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-500">Sexe / Sex :</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={data.babyGender === "MALE"} readOnly className="pointer-events-none" />
                      <span>Masculin/Male</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={data.babyGender === "FEMALE"} readOnly className="pointer-events-none" />
                      <span>Féminin/Female</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Poids / Weight :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {data.weightGrams ? `${data.weightGrams} g` : ".................."}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2 : MÈRE */}
            <div className="border border-black rounded-sm mb-2 overflow-hidden">
              <h2 className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Section 2 : Renseignements sur la mère / Mother's information
              </h2>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="col-span-2 flex gap-1">
                  <span className="text-neutral-500">Noms et Prénoms / Full Name :</span>
                  <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
                    {motherFullName || "......................................................................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Nationalité / Nationality :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {data.motherNationality || "........................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">N° CNI / ID Card No :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1 font-mono">
                    {data.motherCni || "........................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Profession / Occupation :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {data.motherProfession || "........................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Téléphone / Phone :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {data.motherPhone || "........................................"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 3 : PÈRE */}
            <div className="border border-black rounded-sm mb-2 overflow-hidden">
              <h2 className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Section 3 : Renseignements sur le père / Father's information
              </h2>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="col-span-2 flex gap-1">
                  <span className="text-neutral-500">Noms et Prénoms / Full Name :</span>
                  <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
                    {fatherFullName || "......................................................................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Nationalité / Nationality :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {data.fatherNationality || "........................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">N° CNI / ID Card No :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1 font-mono">
                    {data.fatherCni || "........................................"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4 : DÉCLARANT */}
            <div className="border border-black rounded-sm mb-2 overflow-hidden">
              <h2 className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Section 4 : Renseignements sur le déclarant / Declarant's information
              </h2>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="col-span-2 flex gap-1">
                  <span className="text-neutral-500">Nom du Déclarant / Declarant Name :</span>
                  <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
                    {declarantFullName || motherFullName || "......................................................................................"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Qualité / Status :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1 capitalize">
                    {data.declarantRole || "Mère / Mother"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-neutral-500">Signature du Déclarant :</span>
                  <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                    {declarantFullName ? "[Signature Apposée]" : "........................................"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 5 : ACCUSÉ DE RÉCEPTION */}
            <div className="border border-black rounded-sm overflow-hidden bg-neutral-50">
              <h2 className="bg-neutral-200 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Section 5 : Accusé de réception de l'Officier d'état civil
              </h2>
              <div className="p-2 flex justify-between">
                <div>
                  <p>Atteste avoir reçu cette déclaration de naissance.</p>
                  <p className="mt-2">Nom de l'agent : <span className="font-semibold">{data.secretaireName || "..............................."}</span></p>
                </div>
                <div className="text-right">
                  <p>Date : {formatDate(data.approvedAt || new Date())}</p>
                  <p className="mt-2 font-mono text-[7px] text-neutral-400">TRK: {data.citizenTrackingCode || "TRK-PENDING"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ─── RENDU DU DOCUMENT 2 : ACTE DE NAISSANCE ─── */
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mb-4">
              <p className="font-bold text-[8px] tracking-widest uppercase">Centre d'État Civil / Civil Status Registration Centre</p>
              <p className="font-medium text-[8px]">De / of : <span className="font-bold text-red-600">{data.cityHallName || "MARIE DE YAOUNDÉ"}</span></p>
              <h1 className="font-bold text-sm tracking-wider uppercase border-b border-black pb-1 mt-2 inline-block px-8">
                Acte de Naissance / Birth Certificate
              </h1>
              <div className="text-center mt-2 text-red-600 font-bold font-mono text-[11px] italic">
                N°: {data.certificateNumber || "ACN-2026-LA-PENDING"}
              </div>
            </div>

            {/* Corps de l'acte */}
            <div className="flex-1 space-y-3.5 text-[9px] leading-relaxed mt-2 pl-4">
              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Nom de l'enfant / Surname of the Child :</span>
                <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 text-[11px]">
                  {data.babyLastName || ".................................................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Prénoms de l'enfant / Given name of the Child :</span>
                <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 text-[11px]">
                  {data.babyFirstName || ".................................................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Né(e) le / Born on the :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                  {formatDate(data.birthDate, true)}
                </span>
                <span className="text-neutral-500 shrink-0">Sexe / Sex :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted w-24 pl-1">
                  {data.babyGender === "MALE" ? "Masculin" : data.babyGender === "FEMALE" ? "Féminin" : ".................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">À / At :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
                  {data.birthPlace || data.hospitalName || ".................................................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">De / Of (Père) :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                  {fatherFullName || ".................................................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Et de / And Of (Mère) :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                  {motherFullName || ".................................................."}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Nationalité / Nationality :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                  {data.motherNationality || "Camerounaise / Cameroonian"}
                </span>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-neutral-500 shrink-0">Déclaré le / Declared on the :</span>
                <span className="font-serif italic text-blue-900 border-b border-dotted flex-1 pl-1">
                  {formatDate(data.approvedAt || new Date(), true)}
                </span>
              </div>
            </div>

            {/* Pied de page et signatures */}
            <div className="border-t border-neutral-300 pt-4 mt-6">
              <div className="flex justify-between text-[8px] relative min-h-[90px]">
                <div className="w-[30%] text-center">
                  <p className="font-bold text-neutral-500">Le Secrétaire / Secretary</p>
                  <p className="mt-8 font-serif italic text-blue-900">{data.secretaireName || "MBUYI CECILE"}</p>
                </div>

                {/* QR Code central au bas de l'acte */}
                <div className="w-[35%] flex flex-col items-center justify-center">
                  {data.qrCodeUrl ? (
                    <div className="border p-1 bg-white relative w-16 h-16 shadow-sm">
                      <Image 
                        src={data.qrCodeUrl} 
                        alt="QR Verification" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed border-neutral-300 w-16 h-16 flex flex-col items-center justify-center text-[6px] text-neutral-400 p-1 text-center leading-tight">
                      [QR Code Vérification]
                    </div>
                  )}
                  <span className="text-[5px] text-neutral-400 mt-1 font-mono uppercase">
                    {data.declarationRef || "CID-PENDING"}
                  </span>
                </div>

                <div className="w-[30%] text-center">
                  <p className="font-bold text-neutral-500">L'Officier / Registrar</p>
                  <p className="mt-8 font-serif italic text-blue-900">{data.maireName || "BIYA SIMON"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
