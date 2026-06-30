import * as React from "react"

interface SectionRegistrarProps {
  secretaireName?: string | null
  cityHallName?: string | null
  citizenTrackingCode?: string | null
}

export function SectionRegistrar({
  secretaireName,
  cityHallName,
  citizenTrackingCode,
}: SectionRegistrarProps) {
  return (
    <div className="w-full border border-black border-t-0 select-none text-[7px] font-sans bg-neutral-50/50 text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-0.5 text-[8px] uppercase tracking-wide">
        Section 5 : Accusé de réception de l'Officier d'état civil / Acknowledgment of receipt
      </div>

      <div className="grid grid-cols-12 p-2">
        <div className="col-span-8 flex flex-col justify-between">
          <p className="font-semibold italic">
            J'atteste avoir reçu cette déclaration de naissance. / I testify to have received this birth declaration.
          </p>
          <div className="mt-3 space-y-1">
            <div>
              Nom et Prénom / Name and Surname : <span className="font-serif italic font-bold text-blue-900 uppercase ml-1">{secretaireName || ".................................................."}</span>
            </div>
            <div>
              Qualité / Status : <span className="font-serif italic font-bold text-blue-900 uppercase ml-1">Secrétaire d'État Civil</span>
            </div>
            <div>
              Centre d'état civil / Civil Status Registrar Office : <span className="font-serif italic font-bold text-blue-900 uppercase ml-1">{cityHallName || ".................................................."}</span>
            </div>
          </div>
        </div>

        <div className="col-span-4 border-l border-black pl-2 flex flex-col justify-between items-center text-center">
          <span className="font-semibold text-neutral-500">Signature & Cachet</span>
          <div className="h-6 flex items-center justify-center font-serif italic text-[7px] text-blue-900 font-bold border border-dashed border-neutral-300 w-full rounded-sm bg-white mt-1 select-none">
            {secretaireName ? "[Cachet État Civil]" : "[Attente validation]"}
          </div>
          <div className="w-full mt-2 flex flex-col text-[6px] text-neutral-400 font-mono">
            <span>Date : {new Intl.DateTimeFormat("fr-FR").format(new Date())}</span>
            <span>Code : {citizenTrackingCode || "TRK-PENDING"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
