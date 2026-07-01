import * as React from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import FooterStandard from "@/components/mvpblocks/footer-standard"

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col font-sans antialiased text-neutral-800 relative overflow-x-hidden">
      {/* Background Cameroon Crest Watermarks Pattern - Inclined and visible */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 select-none overflow-hidden">
        <div className="absolute top-12 left-10 w-44 h-44 -rotate-[22deg]">
          <Image src="/cameroon-logo.png" alt="Armoiries du Cameroun" fill className="object-contain" />
        </div>
        <div className="absolute top-1/4 right-12 w-52 h-52 rotate-[18deg]">
          <Image src="/cameroon-logo.png" alt="Armoiries du Cameroun" fill className="object-contain" />
        </div>
        <div className="absolute bottom-1/3 left-16 w-48 h-48 -rotate-[15deg]">
          <Image src="/cameroon-logo.png" alt="Armoiries du Cameroun" fill className="object-contain" />
        </div>
        <div className="absolute bottom-12 right-20 w-56 h-56 rotate-[25deg]">
          <Image src="/cameroon-logo.png" alt="Armoiries du Cameroun" fill className="object-contain" />
        </div>
      </div>
      {/* Cameroonian National Colors Ribbon */}
      <div className="fixed top-0 left-0 right-0 h-1 flex z-50 select-none">
        <div className="flex-1 bg-[#007A5E]" />
        <div className="flex-1 bg-[#CE1126] relative">
          <div className="absolute inset-0 flex items-center justify-center text-[5px] text-[#FCD116] font-bold">★</div>
        </div>
        <div className="flex-1 bg-[#FCD116]" />
      </div>

      {/* Fixed Header */}
      <Header />

      {/* Main content slot */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-8 md:pb-12">
        {children}
      </div>

      {/* Premium Cameroonian Footer */}
      <FooterStandard />
    </div>
  )
}
