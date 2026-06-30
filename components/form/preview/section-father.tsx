import * as React from "react"

interface SectionFatherProps {
  fatherFirstName?: string | null
  fatherLastName?: string | null
  fatherBirthDate?: string | Date | null
  fatherNationality?: string | null
  fatherCni?: string | null
  fatherProfession?: string | null
  fatherAddress?: string | null
  fatherPhone?: string | null
}

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR").format(date)
}

export function SectionFather({
  fatherFirstName,
  fatherLastName,
  fatherBirthDate,
  fatherNationality,
  fatherCni,
  fatherProfession,
  fatherAddress,
  fatherPhone,
}: SectionFatherProps) {
  const fatherFullName = [fatherFirstName, fatherLastName].filter(Boolean).join(" ") || ""

  return (
    <div className="w-full border border-black border-t-0 select-none text-[7px] font-sans text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wide">
        Section 3 : Renseignements sur le père / Father's information (instruction no 3)
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-1">
          <span className="text-neutral-500">Noms et Prénoms / Name and Surname :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{fatherFullName || "......................................................................................"}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-1">
          <span className="text-neutral-500">Date et lieu de naissance / Date and Place of birth :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1">
            {fatherBirthDate ? formatDate(fatherBirthDate) : "........................................"}{" "}
            {fatherAddress ? `à ${fatherAddress}` : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">Domicile / Domicile :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{fatherAddress || ""}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">Contact / Phone number :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1">{fatherPhone || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-6 border-r border-black p-1">
          <span className="text-neutral-500">Profession / Profession :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{fatherProfession || ""}</span>
        </div>
        <div className="col-span-6 p-1">
          <span className="text-neutral-500">Niveau de scolarité / Level of education :</span>
          <div className="flex gap-2 mt-0.5">
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-1.5 h-1.5 border border-black"></span>
              <span>Primaire</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-1.5 h-1.5 border border-black"></span>
              <span>Secondaire</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="inline-block w-1.5 h-1.5 border border-black"></span>
              <span>Supérieur</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 p-1">
        <div className="col-span-6 border-r border-black">
          <span className="text-neutral-500">Nationalité / Nationality :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 uppercase">{fatherFullName ? (fatherNationality || "CAMEROUNAISE") : ""}</span>
        </div>
        <div className="col-span-6 pl-1">
          <span className="text-neutral-500">N° CNI / ID Card No :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 font-mono uppercase">{fatherCni || ""}</span>
        </div>
      </div>
    </div>
  )
}
