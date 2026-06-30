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
    motherNationality?: string | null
    fatherFirstName?: string | null
    fatherLastName?: string | null
    fatherNationality?: string | null
    certificateNumber?: string | null
    cityHallName?: string | null
    cityHallCity?: string | null
    approvedAt?: string | Date | null
    maireName?: string | null
    secretaireName?: string | null
    qrCodeUrl?: string | null
  }
}

function formatDate(dateStr?: string | Date | null, verbose = false) {
  if (!dateStr) return ".........................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".........................................."
  
  if (verbose) {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)
  }
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function CertificatePreview({ data }: CertificatePreviewProps) {
  const babyFullName = [data.babyFirstName, data.babyLastName].filter(Boolean).join(" ") || ""
  const motherFullName = [data.motherFirstName, data.motherLastName].filter(Boolean).join(" ") || ""
  const fatherFullName = [data.fatherFirstName, data.fatherLastName].filter(Boolean).join(" ") || ""

  return (
    <div className="w-full aspect-[1/1.414] bg-white text-black p-6 md:p-8 flex flex-col relative overflow-hidden shadow-2xl select-none text-[8px] font-sans text-left border border-neutral-300 rounded-sm">
      {/* Armoiries et filigrane */}
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
        <div className="absolute rotate-[33deg] text-[36px] font-black tracking-widest text-neutral-800 whitespace-nowrap opacity-[0.4] select-none">
          PAIX TRAVAIL PATRIE · PEACE WORK FATHERLAND
        </div>
      </div>

      {/* En-tête officiel */}
      <div className="flex justify-between items-start border-b pb-2 mb-4 border-neutral-200">
        <div className="text-center w-[40%] flex flex-col items-center">
          <span className="font-bold text-[8.5px] uppercase tracking-wider">République du Cameroun</span>
          <span className="text-[6.5px] text-neutral-500 italic mt-0.5">Republic of Cameroon</span>
          <span className="font-medium text-[7.5px] mt-0.5">Paix - Travail - Patrie</span>
          <div className="mt-1.5 text-left w-full text-[6.5px] space-y-0.5 text-neutral-600">
            <div>Région : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "LITTORAL" : "...................."}</span></div>
            <div>Département : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "WOURI" : "...................."}</span></div>
            <div>Arrondissement : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "DOUALA V" : "...................."}</span></div>
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
          <span className="font-bold text-[8.5px] uppercase tracking-wider">Republic of Cameroon</span>
          <span className="text-[6.5px] text-neutral-500 italic mt-0.5">Peace - Work - Fatherland</span>
          <div className="mt-2.5 text-left w-full text-[6.5px] space-y-0.5 text-neutral-600">
            <div>Region : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "LITTORAL" : "...................."}</span></div>
            <div>Division : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "WOURI" : "...................."}</span></div>
            <div>Subdivision : <span className="font-semibold text-black uppercase">{data.cityHallCity ? "DOUALA V" : "...................."}</span></div>
          </div>
        </div>
      </div>

      {/* Titre de l'acte */}
      <div className="text-center mb-4">
        <p className="font-bold text-[7.5px] tracking-widest uppercase">Centre d'État Civil / Civil Status Registration Centre</p>
        <p className="font-medium text-[7.5px]">De / of : <span className="font-bold text-red-600 uppercase">{data.cityHallName || "MARIE DE DOUALA 2EME"}</span></p>
        <h1 className="font-bold text-[11px] tracking-wider uppercase border-b border-black pb-1 mt-2 inline-block px-8">
          Acte de Naissance / Birth Certificate
        </h1>
        <div className="text-center mt-1.5 text-red-600 font-bold font-mono text-[10px] italic">
          N°: {data.certificateNumber || "ACN-2026-LA-PENDING"}
        </div>
      </div>

      {/* Lignes d'informations */}
      <div className="flex-1 space-y-3.5 text-[8.5px] leading-relaxed mt-2 pl-4">
        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Nom de l'enfant / Surname of the Child :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 text-[10.5px] uppercase">
            {data.babyLastName || ".................................................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Prénoms de l'enfant / Given name of the Child :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 text-[10.5px] uppercase">
            {data.babyFirstName || ".................................................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Né(e) le / Born on the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
            {formatDate(data.birthDate, true)}
          </span>
          <span className="text-neutral-500 shrink-0">Sexe / Sex :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted w-24 pl-1">
            {data.babyGender === "MALE" ? "Féminin/Female" : data.babyGender === "FEMALE" ? "Féminin/Female" : ".................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">À / At :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
            {data.birthPlace || ".................................................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">De / Of (Père) :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
            {fatherFullName || ".................................................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Et de / And Of (Mère) :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
            {motherFullName || ".................................................."}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Nationalité / Nationality :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1 uppercase">
            {data.motherNationality || "Camerounaise / Cameroonian"}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className="text-neutral-500 shrink-0">Déclaré le / Declared on the :</span>
          <span className="font-serif italic font-bold text-blue-900 border-b border-dotted flex-1 pl-1">
            {formatDate(data.approvedAt || new Date(), true)}
          </span>
        </div>
      </div>

      {/* Signature et QR Code */}
      <div className="border-t border-neutral-300 pt-4 mt-6">
        <div className="flex justify-between text-[7.5px] relative min-h-[80px]">
          <div className="w-[30%] text-center">
            <p className="font-bold text-neutral-500">Le Secrétaire / Secretary</p>
            <p className="mt-8 font-serif italic text-blue-900 uppercase">{data.secretaireName || "MBUYI CECILE"}</p>
          </div>

          <div className="w-[35%] flex flex-col items-center justify-center">
            {data.qrCodeUrl ? (
              <div className="border p-1 bg-white relative w-14 h-14 shadow-sm">
                <Image 
                  src={data.qrCodeUrl} 
                  alt="QR Verification" 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 w-14 h-14 flex flex-col items-center justify-center text-[6px] text-neutral-400 p-1 text-center leading-tight">
                [QR Code Vérification]
              </div>
            )}
            <span className="text-[5px] text-neutral-400 mt-1 font-mono uppercase">
              {data.certificateNumber || "ACN-2026-PENDING"}
            </span>
          </div>

          <div className="w-[30%] text-center">
            <p className="font-bold text-neutral-500">L'Officier / Registrar</p>
            <p className="mt-8 font-serif italic text-blue-900 uppercase">{data.maireName || "BIYA SIMON"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
