import * as React from "react"
import Image from "next/image"
import { CertificateHeader } from "./certificate-header"
import { CertificateBody } from "./certificate-body"
import { CertificateSignatures } from "./certificate-signatures"

interface CertificatePreviewProps {
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
    motherPhone?: string | null
    
    fatherFirstName?: string | null
    fatherLastName?: string | null
    fatherBirthDate?: string | Date | null
    fatherNationality?: string | null
    fatherCni?: string | null
    fatherProfession?: string | null
    fatherAddress?: string | null
    fatherPhone?: string | null
    
    parentsMarried?: boolean
    marriageCertNumber?: string | null
    marriageDate?: string | Date | null
    
    certificateNumber?: string | null
    cityHallName?: string | null
    cityHallCity?: string | null
    approvedAt?: string | Date | null
    maireName?: string | null
    secretaireName?: string | null
    qrCodeUrl?: string | null
    
    declarantFirstName?: string | null
    declarantLastName?: string | null
    declarantRole?: string | null
    declarantCni?: string | null
    
    hospitalName?: string | null
    declarationRef?: string | null
    citizenTrackingCode?: string | null
  }
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
        qrCodeUrl={data.qrCodeUrl}
        certificateNumber={data.certificateNumber}
      />
    </div>
  )
}
