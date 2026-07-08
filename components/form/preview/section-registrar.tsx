import * as React from "react"
import Image from "next/image"
import { getBaseUrl } from "@/lib/utils"

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
    <div className="w-full border border-black border-t-0 select-none text-[9.5px] font-sans bg-neutral-50/50 text-black">
      {/* Titre de section */}
      <div className="bg-neutral-100 border-b border-black font-bold px-2 py-1 text-[10px] uppercase tracking-wide">
        Section 5 : Accusé de réception de l'Officier d'état civil / Acknowledgment of receipt
      </div>

      <div className="grid grid-cols-12 p-3">
        <div className="col-span-8 flex flex-col justify-between">
          <p className="font-semibold italic text-[9.5px]">
            J'atteste avoir reçu cette déclaration de naissance. / I testify to have received this birth declaration.
          </p>
          <div className="mt-3 space-y-1 text-[9px]">
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

        <div className="col-span-4 border-l border-black pl-3 flex flex-col justify-between items-center text-center">
          <span className="font-semibold text-neutral-500 text-[8px] uppercase tracking-wide">Signature, Cachet & Suivi QR</span>
          <div className="flex gap-2 items-center justify-center w-full mt-1.5">
            <div className="h-10 flex items-center justify-center font-serif italic text-[7px] text-blue-900 font-bold border border-dashed border-neutral-300 flex-1 rounded-sm bg-white select-none">
              {secretaireName ? "[Cachet Mairie]" : "[Attente]"}
            </div>
            {citizenTrackingCode ? (
              <div className="relative w-10 h-10 border border-neutral-200 bg-white p-0.5 shrink-0 rounded shadow-xs">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${citizenTrackingCode}`)}`}
                  alt="QR Code Suivi"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 border border-dashed border-neutral-300 flex items-center justify-center text-[5px] text-neutral-400 p-0.5 text-center shrink-0">
                [QR]
              </div>
            )}
          </div>
          <div className="w-full mt-2 flex flex-col text-[7px] text-neutral-400 font-mono">
            <span>Date : {new Intl.DateTimeFormat("fr-FR").format(new Date())}</span>
            <span>Code : {citizenTrackingCode || "TRK-PENDING"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
