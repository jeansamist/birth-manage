import * as React from "react"
import Image from "next/image"

interface DeclarationHeaderProps {
  declarationRef?: string | null
  cityHallCity?: string | null
  hospitalName?: string | null
}

export function DeclarationHeader({ declarationRef, cityHallCity, hospitalName }: DeclarationHeaderProps) {
  return (
    <div className="w-full flex flex-col select-none text-[8px] font-sans text-black">
      {/* Double en-tête national */}
      <div className="flex justify-between items-start mb-2">
        {/* Partie gauche (Français) */}
        <div className="w-[42%] text-center flex flex-col items-center">
          <span className="font-bold text-[9px] uppercase tracking-wider">République du Cameroun</span>
          <span className="font-medium text-[7px] leading-tight">Paix-Travail-Patrie</span>
          <span className="text-[6px] text-neutral-400">-------------</span>
          <div className="text-left w-full mt-1 space-y-0.5 text-[7px]">
            <div>Région : <span className="font-semibold">{cityHallCity ? "LITTORAL" : "........................................"}</span></div>
            <div>Département : <span className="font-semibold">{cityHallCity ? "WOURI" : "........................................"}</span></div>
            <div>Arrondissement : <span className="font-semibold">{cityHallCity ? "DOUALA V" : "........................................"}</span></div>
            <div>District de Santé : <span className="font-semibold">{hospitalName ? "District de Deido" : "........................................"}</span></div>
            <div>Aire de santé : <span className="font-semibold">{hospitalName ? "Aire de Laquintinie" : "........................................"}</span></div>
            <div>Formation Sanitaire : <span className="font-semibold uppercase">{hospitalName || "........................................"}</span></div>
            <div>Ville ou Village ou Quartier : <span className="font-semibold">{cityHallCity ? "Douala" : "........................................"}</span></div>
          </div>
        </div>

        {/* Partie centrale (armoiries) */}
        <div className="w-[16%] flex flex-col items-center justify-center shrink-0">
          <div className="relative w-12 h-12">
            <Image 
              src="/cameroon-logo.png" 
              alt="Armoiries du Cameroun" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>

        {/* Partie droite (Anglais) */}
        <div className="w-[42%] text-center flex flex-col items-center font-sans">
          <span className="font-bold text-[9px] uppercase tracking-wider">Republic of Cameroon</span>
          <span className="font-medium text-[7px] leading-tight">Peace-Work-Fatherland</span>
          <span className="text-[6px] text-neutral-400">-------------</span>
          <div className="text-left w-full mt-1 space-y-0.5 text-[7px] pl-2">
            <div>Region : <span className="font-semibold">{cityHallCity ? "LITTORAL" : "........................................"}</span></div>
            <div>Division : <span className="font-semibold">{cityHallCity ? "WOURI" : "........................................"}</span></div>
            <div>Subdivision : <span className="font-semibold">{cityHallCity ? "DOUALA V" : "........................................"}</span></div>
            <div>Health District : <span className="font-semibold">{hospitalName ? "Deido Health District" : "........................................"}</span></div>
            <div>Health Facility : <span className="font-semibold uppercase">{hospitalName || "........................................"}</span></div>
            <div>Town or Village or Quarter : <span className="font-semibold">{cityHallCity ? "Douala" : "........................................"}</span></div>
          </div>
        </div>
      </div>

      {/* Titre central encadré */}
      <div className="border border-black flex w-full mt-1">
        <div className="flex-1 border-r border-black p-2 flex flex-col items-center justify-center text-center">
          <h1 className="font-bold text-xs uppercase tracking-wide leading-tight">
            Déclaration de Naissance / Birth Declaration
          </h1>
          <p className="text-[6px] text-neutral-500 italic mt-0.5">
            Bien vouloir lire attentivement les instructions avant de remplir le formulaire / Kindly read the instructions before completing this form
          </p>
        </div>
        <div className="w-[140px] p-2 flex flex-col justify-center items-center font-bold text-xs">
          <div>N° <span className="font-mono text-blue-900 ml-1 underline">{declarationRef || "_________/20___"}</span></div>
        </div>
      </div>
    </div>
  )
}
