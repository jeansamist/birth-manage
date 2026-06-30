import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionChildProps {
  babyFirstName?: string | null
  babyLastName?: string | null
  babyGender?: "MALE" | "FEMALE" | null
  birthDate?: string | Date | null
  birthPlace?: string | null
  weightGrams?: number | string | null
  heightCm?: number | string | null
  deliveryType?: string | null
}

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function SectionChild({
  babyFirstName,
  babyLastName,
  babyGender,
  birthDate,
  birthPlace,
  weightGrams,
  heightCm,
  deliveryType,
}: SectionChildProps) {
  const isMale = babyGender === "MALE"
  const isFemale = babyGender === "FEMALE"

  return (
    <div className="w-full border border-black border-t-0 select-none text-[7px] font-sans text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wide">
        Section 1 : Renseignements sur l'enfant / Child's informations (instruction N° 1)
      </div>

      {/* Grid des données */}
      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">Noms / Name :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{babyLastName || ""}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">Prénoms / Surname :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{babyFirstName || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">*Date de naissance / Date of Birth :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1">{formatDate(birthDate)}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">*Lieu de naissance / Place of Birth (Ville/Town, Village) :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{birthPlace || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-1 flex items-center gap-4">
          <span className="text-neutral-500">*Sexe / Sex :</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className={cn("inline-block w-2.5 h-2.5 border border-black text-center leading-none text-[6px]", isMale && "bg-neutral-800 text-white font-bold")}>
                {isMale ? "✓" : ""}
              </span>
              <span>Masculin / Male</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={cn("inline-block w-2.5 h-2.5 border border-black text-center leading-none text-[6px]", isFemale && "bg-neutral-800 text-white font-bold")}>
                {isFemale ? "✓" : ""}
              </span>
              <span>Féminin / Female</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">Type de naissance / Type of birth :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{deliveryType || "SIMPLE"}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">Rang de naissance / Rank of birth :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">1er / 1st</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">Poids de l'enfant / Weight of child :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1">{weightGrams ? `${weightGrams} g` : ""}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">Taille de l'enfant / Height of child :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1">{heightCm ? `${heightCm} cm` : ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 p-1">
        <div className="col-span-12 flex items-center gap-2">
          <span className="text-neutral-500">Personne ayant assisté la mère au moment de l'accouchement :</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-2 h-2 border border-black text-center leading-none text-[5px]">✓</span>
              <span>Médecin</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-2 h-2 border border-black text-center leading-none text-[5px]"></span>
              <span>Sage-femme</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-2 h-2 border border-black text-center leading-none text-[5px]"></span>
              <span>Infirmière</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-2 h-2 border border-black text-center leading-none text-[5px]"></span>
              <span>Aucune</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
