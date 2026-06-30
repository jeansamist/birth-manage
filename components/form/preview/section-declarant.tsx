import * as React from "react"

interface SectionDeclarantProps {
  declarantFirstName?: string | null
  declarantLastName?: string | null
  declarantRole?: string | null
  declarantPhone?: string | null
  motherFirstName?: string | null
  motherLastName?: string | null
}

export function SectionDeclarant({
  declarantFirstName,
  declarantLastName,
  declarantRole,
  declarantPhone,
  motherFirstName,
  motherLastName,
}: SectionDeclarantProps) {
  const motherFullName = [motherFirstName, motherLastName].filter(Boolean).join(" ") || ""
  const declarantFullName = [declarantFirstName, declarantLastName].filter(Boolean).join(" ") || motherFullName
  const role = declarantRole || "MOTHER"

  return (
    <div className="w-full border border-black border-t-0 select-none text-[9.5px] font-sans text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-1 text-[10px] uppercase tracking-wide">
        Section 4 : Renseignements sur le déclarant / Declarant's information
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-8 border-r border-black p-2">
          <span className="text-neutral-500">*Noms et Prénoms / Name and Surname :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs uppercase">{declarantFullName}</span>
        </div>
        <div className="col-span-4 p-2">
          <span className="text-neutral-500">Contact / Phone number :</span>
          <span className="font-serif italic font-bold text-blue-900 ml-1 text-xs">{declarantPhone || ""}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-12 p-2 flex items-center gap-3">
          <span className="text-neutral-500">*Qualité / Status :</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 border border-black text-center leading-none text-[7px] ${role === "MOTHER" || role === "Mère" ? "bg-neutral-800 text-white font-bold" : ""}`}>
                {role === "MOTHER" || role === "Mère" ? "✓" : ""}
              </span>
              <span>Mère / Mother</span>
            </span>
            <span className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 border border-black text-center leading-none text-[7px] ${role === "FATHER" || role === "Père" ? "bg-neutral-800 text-white font-bold" : ""}`}>
                {role === "FATHER" || role === "Père" ? "✓" : ""}
              </span>
              <span>Père / Father</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border border-black text-center leading-none text-[7px]"></span>
              <span>Autre / Other</span>
            </span>
          </div>
        </div>
      </div>

      {/* Attestation et Signature */}
      <div className="grid grid-cols-12 p-2 text-[8px] leading-relaxed">
        <div className="col-span-7 pr-3 flex flex-col justify-between">
          <p className="font-medium text-[8px]">
            Nous attestons que les informations contenues dans ce formulaire sont exactes. / We testify that the information provided in this form are valid.
          </p>
          <div className="mt-4 flex justify-between border-t border-dotted pt-1 border-neutral-400">
            <span>Signature (Père/Mère/Tuteur)</span>
            <span>Date : {new Intl.DateTimeFormat("fr-FR").format(new Date())}</span>
          </div>
        </div>
        <div className="col-span-5 border-l border-black pl-3 flex flex-col justify-between">
          <p className="font-medium italic text-neutral-500">
            Signature du déclarant / Declarant signature :
          </p>
          <div className="h-6 flex items-center justify-center font-serif italic text-blue-900 font-bold uppercase text-[9px] mt-2">
            {declarantFullName ? `[${declarantFullName.split(" ").map(w => w[0]).join("")}]` : ""}
          </div>
          <div className="flex justify-between border-t border-dotted pt-1 border-neutral-400">
            <span>Date : {new Intl.DateTimeFormat("fr-FR").format(new Date())}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
