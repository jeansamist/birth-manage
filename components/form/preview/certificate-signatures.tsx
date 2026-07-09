import * as React from "react"
import Image from "next/image"

interface CertificateSignaturesProps {
  secretaireName?: string | null
  maireName?: string | null
  maireSignatureUrl?: string | null
  qrCodeUrl?: string | null
  certificateNumber?: string | null
}

export function CertificateSignatures({
  secretaireName,
  maireName,
  maireSignatureUrl,
  qrCodeUrl,
  certificateNumber,
}: CertificateSignaturesProps) {
  return (
    <div className="border-t border-neutral-300 pt-4 mt-6 shrink-0 w-full select-none">
      <div className="flex justify-between text-[8px] relative min-h-[85px]">
        {/* Secrétaire */}
        <div className="w-[30%] text-center">
          <p className="font-bold text-neutral-500 uppercase tracking-wider text-[7.5px]">Le Secrétaire / Secretary</p>
          <p className="mt-8 font-serif italic text-blue-900 uppercase font-bold text-[9px]">{secretaireName || "MBUYI CECILE"}</p>
        </div>

        {/* QR Verification */}
        <div className="w-[35%] flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <div className="border p-1 bg-white relative w-16 h-16 shadow-md rounded-sm">
              <Image 
                src={qrCodeUrl} 
                alt="QR Verification" 
                fill 
                className="object-contain"
              />
            </div>
          ) : (
            <div className="border border-dashed border-neutral-300 w-16 h-16 flex flex-col items-center justify-center text-[5.5px] text-neutral-400 p-1 text-center leading-tight">
              [QR CODE VERIFICATION]
            </div>
          )}
          <span className="text-[5px] text-neutral-400 mt-1 font-mono uppercase tracking-wider">
            {certificateNumber || "ACN-2026-PENDING"}
          </span>
        </div>

        {/* Officier */}
        <div className="w-[30%] text-center">
          <p className="font-bold text-neutral-500 uppercase tracking-wider text-[7.5px]">L'Officier / Registrar</p>
          {maireSignatureUrl ? (
            <div className="h-8 flex items-end justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={maireSignatureUrl} alt="Signature du maire" className="max-h-8 max-w-[80%] object-contain" />
            </div>
          ) : (
            <div className="h-8" />
          )}
          <p className="font-serif italic text-blue-900 uppercase font-bold text-[9px]">{maireName || "BIYA SIMON"}</p>
        </div>
      </div>
    </div>
  )
}
