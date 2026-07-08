import * as React from "react"
import Image from "next/image"

interface CertificateHeaderProps {
  cityHallCity?: string | null
  cityHallName?: string | null
  certificateNumber?: string | null
}

export function CertificateHeader({
  cityHallCity,
  cityHallName,
  certificateNumber,
}: CertificateHeaderProps) {
  return (
    <div className="flex flex-col shrink-0 w-full select-none text-[8.5px] font-sans">
      {/* En-tête bilingue officiel */}
      <div className="flex justify-between items-start border-b pb-2 mb-4 border-neutral-200">
        {/* En-tête gauche (FR) */}
        <div className="text-left w-[40%] flex flex-col">
          <span className="font-bold text-[9px] uppercase tracking-wide">République du Cameroun</span>
          <span className="text-[7px] text-neutral-600 italic">Paix-Travail-Patrie</span>
          <span className="text-[7px] text-neutral-400">------------------</span>
          <div className="mt-1 space-y-0.5 text-[7px] text-neutral-800">
            <div>Région : <span className="font-semibold uppercase">{cityHallCity ? "LITTORAL" : "LITTORAL"}</span></div>
            <div>Département : <span className="font-semibold uppercase">{cityHallCity ? "WOURI" : "WOURI"}</span></div>
            <div>Arrondissement : <span className="font-semibold uppercase">{cityHallCity ? "DOUALA V" : "DOUALA V"}</span></div>
          </div>
        </div>

        {/* Armoiries nationales */}
        <div className="flex justify-center items-center shrink-0 pt-1">
          <div className="relative w-12 h-12">
            <Image
              src="/cameroon-logo.png"
              alt="Armoiries du Cameroun"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* En-tête droit (EN) */}
        <div className="text-left w-[40%] flex flex-col items-end">
          <span className="font-bold text-[9px] uppercase tracking-wide">Republic of Cameroon</span>
          <span className="text-[7px] text-neutral-600 italic">Peace-Work-Fatherland</span>
          <span className="text-[7px] text-neutral-400">------------------</span>
          <div className="mt-1 space-y-0.5 text-[7px] text-neutral-800 text-right">
            <div>Region : <span className="font-semibold uppercase">{cityHallCity ? "LITTORAL" : "LITTORAL"}</span></div>
            <div>Division : <span className="font-semibold uppercase">{cityHallCity ? "WOURI" : "WOURI"}</span></div>
            <div>Subdivision : <span className="font-semibold uppercase">{cityHallCity ? "DOUALA V" : "DOUALA V"}</span></div>
          </div>
        </div>
      </div>

      {/* Titre central de l'acte */}
      <div className="text-center mb-6">
        <p className="font-bold text-[8px] uppercase tracking-wider text-neutral-700">Centre d'état civil / Civil Status Registration Centre</p>
        <p className="font-semibold text-[8.5px] mt-0.5 text-neutral-900">De / of : <span className="font-bold text-neutral-950 uppercase">{cityHallName || "MAIRIE DE DOUALA 5EME"}</span></p>
        <h1 className="font-bold text-[12px] tracking-widest uppercase border-b-2 border-neutral-900 pb-0.5 mt-2 inline-block px-12 text-neutral-900">
          Acte de Naissance / Birth Certificate
        </h1>
        <div className="text-center mt-2 text-red-600 font-bold font-mono text-[10.5px]">
          N°: {certificateNumber || "ACN-2026-LA-PENDING"}
        </div>
      </div>
    </div>
  )
}
