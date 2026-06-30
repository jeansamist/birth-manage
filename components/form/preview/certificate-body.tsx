import * as React from "react"
import { dateToFrenchLetters, formatDateStandard } from "@/lib/utils/date-words"

interface CertificateBodyProps {
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
    fatherFirstName?: string | null
    fatherLastName?: string | null
    fatherBirthDate?: string | Date | null
    fatherNationality?: string | null
    fatherCni?: string | null
    fatherProfession?: string | null
    fatherAddress?: string | null
    approvedAt?: string | Date | null
    declarantFirstName?: string | null
    declarantLastName?: string | null
    declarantCni?: string | null
    hospitalName?: string | null
    maireName?: string | null
    secretaireName?: string | null
  }
}

export function CertificateBody({ data }: CertificateBodyProps) {
  const motherFullName = [data.motherFirstName, data.motherLastName].filter(Boolean).join(" ") || ""
  const fatherFullName = [data.fatherFirstName, data.fatherLastName].filter(Boolean).join(" ") || ""
  
  const fatherBirthPlace = data.fatherAddress
    ? data.fatherAddress.split(",")[1]?.trim() || data.fatherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const motherBirthPlace = data.motherAddress
    ? data.motherAddress.split(",")[1]?.trim() || data.motherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  return (
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
  )
}
