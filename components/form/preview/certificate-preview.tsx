import * as React from "react"
import Image from "next/image"
import { CertificateHeader } from "./certificate-header"
import { CertificateBody } from "./certificate-body"
import { CertificateSignatures } from "./certificate-signatures"
import type { PreviewData } from "../document-preview"

interface CertificatePreviewProps {
  data: PreviewData
}

export function CertificatePreview({ data }: CertificatePreviewProps) {
  return (
    <div className="w-full min-h-[1120px] bg-white text-black p-8 flex flex-col relative shadow-2xl select-none text-[8.5px] font-sans text-left border border-neutral-300 rounded-sm">
      {/* Armoiries et filigrane en arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none">
        <div className="relative w-96 h-96">
          <Image 
            src="/cameroon-logo.png" 
            alt="Armoiries du Cameroun" 
            fill 
            sizes="384px"
            className="object-contain"
            priority 
          />
        </div>
        <div className="absolute rotate-[33deg] text-[34px] font-black tracking-widest text-neutral-800 whitespace-nowrap opacity-[0.35] select-none">
          PAIX TRAVAIL PATRIE · PEACE WORK FATHERLAND
        </div>
      </div>

      <CertificateHeader 
        cityHallCity={data.cityHallCity}
        cityHallName={data.cityHallName}
        certificateNumber={data.certificateNumber}
      />

      <CertificateBody data={data} />

      <CertificateSignatures
        secretaireName={data.secretaireName}
        maireName={data.maireName}
        maireSignatureUrl={data.maireSignatureUrl}
        qrCodeUrl={data.qrCodeUrl}
        certificateNumber={data.certificateNumber}
      />
    </div>
  )
}
