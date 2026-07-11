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
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans antialiased text-foreground relative overflow-x-hidden">
      {/* Cameroonian National Colors Ribbon */}
      <div className="fixed top-0 left-0 right-0 h-1 flex z-[60] select-none">
        <div className="flex-1 bg-[#007A5E]" />
        <div className="flex-1 bg-[#CE1126] relative">
          <div className="absolute inset-0 flex items-center justify-center text-[5px] text-[#FCD116] font-bold">★</div>
        </div>
        <div className="flex-1 bg-[#FCD116]" />
      </div>

      {/* Centered Cameroon Seal Watermark - Clean & Upright */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] flex items-center justify-center z-0 select-none">
        <div className="relative w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] md:w-[750px] md:h-[750px]">
          <Image
            src="/cameroon-logo.png"
            alt="Armoiries de la République du Cameroun"
            fill
            sizes="750px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Fixed Header */}
      <Header />

      {/* Main content slot - Full width to allow split-screen pages to take full bleed */}
      <div className="flex-1 w-full pt-28 flex flex-col min-h-0">
        {children}
      </div>

      {/* Premium Cameroonian Footer */}
      <FooterStandard />
    </div>
  )
}
