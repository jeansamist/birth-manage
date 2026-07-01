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
      {/* Centered Cameroon Seal Watermark - Clean & Upright */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] flex items-center justify-center z-0 select-none">
        <div className="relative w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] md:w-[750px] md:h-[750px]">
          <Image
            src="/cameroon-logo.png"
            alt="Armoiries de la République du Cameroun"
            fill
            className="object-contain"
            priority
          />
        </div>
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
