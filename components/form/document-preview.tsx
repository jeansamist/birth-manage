"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Importation des sous-composants découplés
import { DeclarationHeader } from "./preview/declaration-header"
import { SectionChild } from "./preview/section-child"
import { SectionMother } from "./preview/section-mother"
import { SectionFather } from "./preview/section-father"
import { SectionDeclarant } from "./preview/section-declarant"
import { SectionRegistrar } from "./preview/section-registrar"
import { CertificatePreview } from "./preview/certificate-preview"

// Types pour le composant de prévisualisation
export interface PreviewData {
  // Enfant
  babyFirstName?: string | null
  babyLastName?: string | null
  babyGender?: "MALE" | "FEMALE" | null
  birthDate?: string | Date | null
  birthTime?: string | null
  birthPlace?: string | null
  weightGrams?: number | string | null
  heightCm?: number | string | null
  apgarScore?: number | string | null
  deliveryType?: string | null
  
  // Mère
  motherFirstName?: string | null
  motherLastName?: string | null
  motherBirthDate?: string | Date | null
  motherNationality?: string | null
  motherCni?: string | null
  motherProfession?: string | null
  motherAddress?: string | null
  motherPhone?: string | null
  motherEmail?: string | null
  
  // Père
  fatherFirstName?: string | null
  fatherLastName?: string | null
  fatherBirthDate?: string | Date | null
  fatherNationality?: string | null
  fatherCni?: string | null
  fatherProfession?: string | null
  fatherAddress?: string | null
  fatherPhone?: string | null
  
  // Mariage & Déclarant
  parentsMarried?: boolean | null
  marriageCertNumber?: string | null
  marriageDate?: string | Date | null
  declarantFirstName?: string | null
  declarantLastName?: string | null
  declarantPhone?: string | null
  declarantCni?: string | null
  declarantRole?: string | null

  // Métadonnées Mairie / Établissement
  declarationRef?: string | null
  certificateNumber?: string | null
  cityHallName?: string | null
  cityHallCity?: string | null
  hospitalName?: string | null
  approvedAt?: string | Date | null
  maireName?: string | null
  secretaireName?: string | null
  qrCodeUrl?: string | null
}

interface DocumentPreviewProps {
  type: "declaration" | "certificate"
  data: PreviewData
  className?: string
}

export function DocumentPreview({ type, data, className }: DocumentPreviewProps) {
  if (type === "certificate") {
    return <CertificatePreview data={data} />
  }

  return (
    <div className={cn("w-full flex items-center justify-center p-2", className)}>
      <div 
        className="w-full aspect-[1/1.414] bg-white text-black p-6 md:p-8 flex flex-col relative overflow-hidden shadow-2xl select-none border border-neutral-300 rounded-sm font-sans"
        style={{ color: "#000000" }}
      >
        <DeclarationHeader 
          declarationRef={data.declarationRef} 
          cityHallCity={data.cityHallCity} 
          hospitalName={data.hospitalName} 
        />
        
        <SectionChild 
          babyFirstName={data.babyFirstName} 
          babyLastName={data.babyLastName} 
          babyGender={data.babyGender} 
          birthDate={data.birthDate} 
          birthPlace={data.birthPlace} 
          weightGrams={data.weightGrams} 
          heightCm={data.heightCm} 
          deliveryType={data.deliveryType} 
        />

        <SectionMother 
          motherFirstName={data.motherFirstName} 
          motherLastName={data.motherLastName} 
          motherBirthDate={data.motherBirthDate} 
          motherNationality={data.motherNationality} 
          motherCni={data.motherCni} 
          motherProfession={data.motherProfession} 
          motherAddress={data.motherAddress} 
          motherPhone={data.motherPhone} 
          parentsMarried={data.parentsMarried} 
        />

        <SectionFather 
          fatherFirstName={data.fatherFirstName} 
          fatherLastName={data.fatherLastName} 
          fatherBirthDate={data.fatherBirthDate} 
          fatherNationality={data.fatherNationality} 
          fatherCni={data.fatherCni} 
          fatherProfession={data.fatherProfession} 
          fatherAddress={data.fatherAddress} 
          fatherPhone={data.fatherPhone} 
        />

        <SectionDeclarant 
          declarantFirstName={data.declarantFirstName} 
          declarantLastName={data.declarantLastName} 
          declarantRole={data.declarantRole} 
          declarantPhone={data.declarantPhone} 
          motherFirstName={data.motherFirstName} 
          motherLastName={data.motherLastName} 
        />

        <SectionRegistrar 
          secretaireName={data.secretaireName} 
          cityHallName={data.cityHallName} 
          citizenTrackingCode={data.citizenTrackingCode} 
        />
      </div>
    </div>
  )
}
