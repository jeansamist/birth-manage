import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CertificatePreviewProps {
  data: {
    babyFirstName?: string | null
    babyLastName?: string | null
    babyGender?: "MALE" | "FEMALE" | null
    birthDate?: string | Date | null
    birthPlace?: string | null
    
    motherFirstName?: string | null
    motherLastName?: string | null
    motherBirthDate?: string | Date | null
    motherNationality?: string | null
    motherCni?: string | null
    motherProfession?: string | null
    motherAddress?: string | null
    motherPhone?: string | null
    
    fatherFirstName?: string | null
    fatherLastName?: string | null
    fatherBirthDate?: string | Date | null
    fatherNationality?: string | null
    fatherCni?: string | null
    fatherProfession?: string | null
    fatherAddress?: string | null
    fatherPhone?: string | null
    
    parentsMarried?: boolean
    marriageCertNumber?: string | null
    marriageDate?: string | Date | null
    
    certificateNumber?: string | null
    cityHallName?: string | null
    cityHallCity?: string | null
    approvedAt?: string | Date | null
    maireName?: string | null
    secretaireName?: string | null
    qrCodeUrl?: string | null
    
    declarantFirstName?: string | null
    declarantLastName?: string | null
    declarantRole?: string | null
    declarantCni?: string | null
    
    hospitalName?: string | null
    declarationRef?: string | null
    citizenTrackingCode?: string | null
  }
}

function numberToFrenchWords(num: number): string {
  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"]
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"]
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "", "quatre-vingt", "quatre-vingt-dix"]
  
  if (num === 0) return "zéro"
  if (num < 10) return units[num]
  if (num < 20) return teens[num - 10]
  if (num < 70) {
    const ten = Math.floor(num / 10)
    const unit = num % 10
    if (unit === 1) return tens[ten] + " et un"
    return tens[ten] + (unit > 0 ? "-" + units[unit] : "")
  }
  if (num < 80) {
    const unit = num % 10
    if (unit === 1) return "soixante et onze"
    return "soixante-" + teens[unit]
  }
  if (num < 90) {
    const unit = num % 10
    return "quatre-vingt" + (unit > 0 ? "-" + units[unit] : "")
  }
  if (num < 100) {
    const unit = num % 10
    return "quatre-vingt-" + teens[unit]
  }
  return String(num)
}

function yearToFrenchWords(year: number): string {
  if (year === 2026) return "deux mille vingt-six"
  if (year === 2027) return "deux mille vingt-sept"
  if (year >= 2000 && year < 2100) {
    const rest = year - 2000
    if (rest === 0) return "deux mille"
    return "deux mille " + numberToFrenchWords(rest)
  }
  if (year >= 1900 && year < 2000) {
    const rest = year - 1900
    return "mille neuf cent " + numberToFrenchWords(rest)
  }
  return String(year)
}

function dateToFrenchLetters(dateStr?: string | Date | null): string {
  if (!dateStr) return ".................................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".................................................."
  
  const day = date.getDate()
  const monthNames = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  
  const dayStr = day === 1 ? "premier" : numberToFrenchWords(day)
  const yearStr = yearToFrenchWords(year)
  
  return `${dayStr} ${month} ${yearStr}`
}

function formatDateStandard(dateStr?: string | Date | null) {
  if (!dateStr) return ".........................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".........................................."
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)
}

export function CertificatePreview({ data }: CertificatePreviewProps) {
  const babyFullName = [data.babyFirstName, data.babyLastName].filter(Boolean).join(" ") || ""
  const motherFullName = [data.motherFirstName, data.motherLastName].filter(Boolean).join(" ") || ""
  const fatherFullName = [data.fatherFirstName, data.fatherLastName].filter(Boolean).join(" ") || ""
  
  const fatherBirthPlace = data.fatherAddress
    ? data.fatherAddress.split(",")[1]?.trim() || data.fatherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const motherBirthPlace = data.motherAddress
    ? data.motherAddress.split(",")[1]?.trim() || data.motherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  return (
    <div className="w-full min-h-[1120px] bg-white text-black p-8 flex flex-col relative shadow-2xl select-none text-[8.5px] font-sans text-left border border-neutral-300 rounded-sm">
      {/* Armoiries et filigrane en arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none">
        <div className="relative w-96 h-96">
          <Image 
            src="/cameroon-logo.png" 
            alt="Armoiries du Cameroun" 
            fill 
            className="object-contain"
            priority 
          />
        </div>
        <div className="absolute rotate-[33deg] text-[34px] font-black tracking-widest text-neutral-800 whitespace-nowrap opacity-[0.35] select-none">
          PAIX TRAVAIL PATRIE · PEACE WORK FATHERLAND
        </div>
      </div>

      {/* En-tête bilingue officiel */}
      <div className="flex justify-between items-start border-b pb-2 mb-4 border-neutral-200 shrink-0">
        {/* En-tête gauche (FR) */}
        <div className="text-left w-[40%] flex flex-col">
          <span className="font-bold text-[9px] uppercase tracking-wide">République du Cameroun</span>
          <span className="text-[7px] text-neutral-600 italic">Paix-Travail-Patrie</span>
          <span className="text-[7px] text-neutral-400">------------------</span>
          <div className="mt-1 space-y-0.5 text-[7px] text-neutral-800">
            <div>Région : <span className="font-semibold uppercase">{data.cityHallCity ? "LITTORAL" : "LITTORAL"}</span></div>
            <div>Département : <span className="font-semibold uppercase">{data.cityHallCity ? "WOURI" : "WOURI"}</span></div>
            <div>Arrondissement : <span className="font-semibold uppercase">{data.cityHallCity ? "DOUALA V" : "DOUALA V"}</span></div>
          </div>
        </div>

        {/* Timbre rond central CM */}
        <div className="flex justify-center items-center shrink-0 pt-1">
          <div className="border-2 border-neutral-300 rounded-full w-11 h-11 flex items-center justify-center text-xs font-bold text-neutral-400">
            CM
          </div>
        </div>

        {/* En-tête droit (EN) */}
        <div className="text-left w-[40%] flex flex-col items-end">
          <span className="font-bold text-[9px] uppercase tracking-wide">Republic of Cameroon</span>
          <span className="text-[7px] text-neutral-600 italic">Peace-Work-Fatherland</span>
          <span className="text-[7px] text-neutral-400">------------------</span>
          <div className="mt-1 space-y-0.5 text-[7px] text-neutral-800 text-right">
            <div>Region : <span className="font-semibold uppercase">{data.cityHallCity ? "LITTORAL" : "LITTORAL"}</span></div>
            <div>Division : <span className="font-semibold uppercase">{data.cityHallCity ? "WOURI" : "WOURI"}</span></div>
            <div>Subdivision : <span className="font-semibold uppercase">{data.cityHallCity ? "DOUALA V" : "DOUALA V"}</span></div>
          </div>
        </div>
      </div>

      {/* Titre central de l'acte */}
      <div className="text-center mb-6 shrink-0">
        <p className="font-bold text-[8px] uppercase tracking-wider text-neutral-700">Centre d'état civil / Civil Status Registration Centre</p>
        <p className="font-semibold text-[8.5px] mt-0.5 text-neutral-900">De / of : <span className="font-bold text-neutral-950 uppercase">{data.cityHallName || "MAIRIE DE DOUALA 5EME"}</span></p>
        <h1 className="font-bold text-[12px] tracking-widest uppercase border-b-2 border-neutral-900 pb-0.5 mt-2 inline-block px-12 text-neutral-900">
          Acte de Naissance / Birth Certificate
        </h1>
        <div className="text-center mt-2 text-red-600 font-bold font-mono text-[10.5px]">
          N°: {data.certificateNumber || "ACN-2026-LA-PENDING"}
        </div>
      </div>

      {/* Lignes de données de l'acte de naissance (Rendu fidèle à l'image) */}
      <div className="flex-1 space-y-3.5 text-[8.5px] leading-relaxed mt-2 select-text">
        
        {/* Nom */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Nom de l'enfant / Surname of the Child :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 text-[10.5px] uppercase leading-none pb-0.5">
            {data.babyLastName || "................................................................................................................................"}
          </span>
        </div>

        {/* Prénom */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Prénoms de l'enfant / Given name of the Child :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 text-[10.5px] uppercase leading-none pb-0.5">
            {data.babyFirstName || "................................................................................................................................"}
          </span>
        </div>

        {/* Né le + Sexe */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Ne(e) le / Born on the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 leading-none pb-0.5">
            {dateToFrenchLetters(data.birthDate)}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">Sexe / Sex :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-32 pl-2 leading-none pb-0.5">
            {data.babyGender === "MALE" ? "Masculin / Male" : data.babyGender === "FEMALE" ? "Féminin / Female" : "..................................."}
          </span>
        </div>

        {/* Lieu de naissance */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">A / At :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.birthPlace || "................................................................................................................................"}
          </span>
        </div>

        {/* Père */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">De / Of :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {fatherFullName || "................................................................................................................................"}
          </span>
        </div>

        {/* Père détails 1 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Ne a / Born at :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.fatherFirstName ? fatherBirthPlace : "................................................................................"}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">le / the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-48 pl-2 leading-none pb-0.5">
            {data.fatherBirthDate ? formatDateStandard(data.fatherBirthDate) : "................................................"}
          </span>
        </div>

        {/* Père détails 2 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Domicilie a / Resident At :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.fatherAddress || "................................................................................................................................"}
          </span>
        </div>

        {/* Père détails 3 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Nationalite / Nationality :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.fatherNationality || (data.fatherFirstName ? "Camerounaise" : "................................................................................")}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">Profession / Occupation :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-56 pl-2 leading-none pb-0.5">
            {data.fatherProfession || "................................................................................"}
          </span>
        </div>

        {/* Père détails 4 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Document de reference / Reference Document :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.fatherCni || "................................................................................................................................"}
          </span>
        </div>

        {/* Mère */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Et de / And Of :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {motherFullName || "................................................................................................................................"}
          </span>
        </div>

        {/* Mère détails 1 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Nee a / Born at :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {motherBirthPlace}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">le / the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-48 pl-2 leading-none pb-0.5">
            {data.motherBirthDate ? formatDateStandard(data.motherBirthDate) : "................................................"}
          </span>
        </div>

        {/* Mère détails 2 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Domiciliee a / Resident At :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.motherAddress || "................................................................................................................................"}
          </span>
        </div>

        {/* Mère détails 3 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Nationalite / Nationality :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.motherNationality || "Camerounaise"}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">Profession / Occupation :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-56 pl-2 leading-none pb-0.5">
            {data.motherProfession || "................................................................................"}
          </span>
        </div>

        {/* Mère détails 4 */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Document de reference / Reference Document :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.motherCni || "................................................................................................................................"}
          </span>
        </div>

        {/* Déclaration */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Declare le / Declared on the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 leading-none pb-0.5">
            {data.approvedAt ? formatDateStandard(data.approvedAt) : formatDateStandard(new Date())}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">Par / By :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-64 pl-2 uppercase leading-none pb-0.5">
            {data.declarantFirstName ? `${data.declarantFirstName} ${data.declarantLastName}` : "Mère présente / Mother present"}
          </span>
        </div>

        {/* Formation sanitaire */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0 uppercase">{data.hospitalName || "CENTRE HOSPITALIER LAQUINTINIE"}</span>
          <span className="border-b border-dotted border-neutral-400 flex-1 leading-none pb-0.5"></span>
        </div>

        {/* Date d'attestation */}
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">le / on the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 leading-none pb-0.5">
            {data.approvedAt ? formatDateStandard(data.approvedAt) : formatDateStandard(new Date())}
          </span>
          <span className="font-semibold text-neutral-700 shrink-0">/ :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 w-48 pl-2 leading-none pb-0.5">
            {data.declarantCni || "..............................................."}
          </span>
        </div>

        {/* Italic certification */}
        <p className="text-[7.5px] italic text-neutral-500 leading-none pt-1">
          lesquels ont certifie la sincerite de la presente declaration - Who attested to the truth of this declaration
        </p>

        {/* Par nous / Assiste de */}
        <div className="flex items-end gap-2 pt-1">
          <span className="font-semibold text-neutral-700 shrink-0">Par nous / By Us :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.maireName || "BIYA SIMON"} (Officier d'état Civil / Civil Status Registrar)
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-semibold text-neutral-700 shrink-0">Assiste de - In the presence of :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted border-neutral-400 flex-1 pl-2 uppercase leading-none pb-0.5">
            {data.secretaireName || "MBUYI CECILE"} (Secretaire d'état Civil / Civil Status Secretary)
          </span>
        </div>
      </div>

      {/* Signature et QR Code de validation */}
      <div className="border-t border-neutral-300 pt-4 mt-6 shrink-0">
        <div className="flex justify-between text-[8px] relative min-h-[85px]">
          {/* Secrétaire */}
          <div className="w-[30%] text-center">
            <p className="font-bold text-neutral-500 uppercase tracking-wider text-[7.5px]">Le Secrétaire / Secretary</p>
            <p className="mt-8 font-serif italic text-blue-900 uppercase font-bold text-[9px]">{data.secretaireName || "MBUYI CECILE"}</p>
          </div>

          {/* QR Verification */}
          <div className="w-[35%] flex flex-col items-center justify-center">
            {data.qrCodeUrl ? (
              <div className="border p-1 bg-white relative w-16 h-16 shadow-md rounded-sm">
                <Image 
                  src={data.qrCodeUrl} 
                  alt="QR Verification" 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 w-16 h-16 flex flex-col items-center justify-center text-[5.5px] text-neutral-400 p-1 text-center leading-tight">
                [QR CODE VERIFICATION]
              </div>
            )}
            <span className="text-[5px] text-neutral-400 mt-1 font-mono uppercase tracking-wider">
              {data.certificateNumber || "ACN-2026-PENDING"}
            </span>
          </div>

          {/* Officier */}
          <div className="w-[30%] text-center">
            <p className="font-bold text-neutral-500 uppercase tracking-wider text-[7.5px]">L'Officier / Registrar</p>
            <p className="mt-8 font-serif italic text-blue-900 uppercase font-bold text-[9px]">{data.maireName || "BIYA SIMON"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
