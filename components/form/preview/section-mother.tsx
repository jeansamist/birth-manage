import * as React from "react"

interface SectionMotherProps {
  motherFirstName?: string | null
  motherLastName?: string | null
  motherBirthDate?: string | Date | null
  motherNationality?: string | null
  motherCni?: string | null
  motherProfession?: string | null
  motherAddress?: string | null
  motherPhone?: string | null
  parentsMarried?: boolean | null
}

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function SectionMother({
  motherFirstName,
  motherLastName,
  motherBirthDate,
  motherNationality,
  motherCni,
  motherProfession,
  motherAddress,
  motherPhone,
  parentsMarried,
}: SectionMotherProps) {
  const motherFullName = [motherFirstName, motherLastName].filter(Boolean).join(" ") || ""

  return (
    <div className="w-full border border-black border-t-0 select-none text-[9.5px] font-sans text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-1 text-[10px] uppercase tracking-wide">
        Section 2 : Renseignements sur la mère / Mother's information (instruction N° 2)
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-2">
          <span className="text-neutral-500">*Noms et Prénoms / Name and Surname :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs uppercase">{motherFullName}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-2">
          <span className="text-neutral-500">*Date et lieu de naissance / Date and Place of birth :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs">
            {formatDate(motherBirthDate)} {motherAddress ? `à ${motherAddress}` : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-2">
          <span className="text-neutral-500">*Domicile / Domicile :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs uppercase">{motherAddress || ""}</span>
        </div>
        <div className="col-span-6 p-2">
          <span className="text-neutral-500">Durée de la résidence / Duration of residence :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs">5 ans / 5 years</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-2">
          <span className="text-neutral-500">Profession / Profession :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs uppercase">{motherProfession || ""}</span>
        </div>
        <div className="col-span-6 p-2">
          <span className="text-neutral-500">Contact / Phone number :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs">{motherPhone || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-2 flex items-center gap-3">
          <span className="text-neutral-500">Situation matrimoniale / Marital Status :</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 border border-black text-center leading-none text-[7px] ${!parentsMarried ? "bg-neutral-800 text-white font-bold" : ""}`}>
                {!parentsMarried ? "✓" : ""}
              </span>
              <span>Célibataire/Single</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 border border-black text-center leading-none text-[7px] ${parentsMarried ? "bg-neutral-800 text-white font-bold" : ""}`}>
                {parentsMarried ? "✓" : ""}
              </span>
              <span>Mariée/Married</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border border-black text-center leading-none text-[7px]"></span>
              <span>Divorcée/Divorced</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-2">
          <span className="text-neutral-500">Nationalité / Nationality :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs uppercase">{motherNationality || "CAMEROUNAISE"}</span>
        </div>
        <div className="col-span-6 p-2">
          <span className="text-neutral-500">N° CNI / ID Card No :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs font-mono uppercase">{motherCni || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 p-2">
        <div className="col-span-12 flex justify-between">
          <div>Nombre d'enfants vivant : <span className="font-serif italic text-blue-900 font-bold">1</span></div>
          <div>Nombre de décès foetal : <span className="font-serif italic text-blue-900 font-bold">0</span></div>
          <div>Date dernier décès : <span className="font-serif italic text-blue-900 font-bold">/</span></div>
        </div>
      </div>
    </div>
  )
}
