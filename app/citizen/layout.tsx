import * as React from "react"
import Image from "next/image"
import { Header } from "@/components/header"

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

      {/* Modern, Clean Minimalist Footer */}
      <footer className="w-full shrink-0 border-t border-neutral-200 bg-white py-8 text-neutral-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
              BUNEC · Bureau National de l'État Civil du Cameroun
            </p>
            <p className="text-[10px] text-neutral-400">
              Système National d'Enregistrement et de Gestion Numérique de l'État Civil.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
            <a href="#" className="hover:text-neutral-900 transition-colors">Politique de confidentialité</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-900 transition-colors">Conditions d'utilisation</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-900 transition-colors">Portail BUNEC officiel</a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 pt-6 border-t border-neutral-100 text-center text-[9px] text-neutral-400">
          &copy; {new Date().getFullYear()} République du Cameroun. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
