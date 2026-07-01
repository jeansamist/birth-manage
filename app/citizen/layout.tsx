import * as React from "react"
import { Header } from "@/components/header"

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col font-sans antialiased text-neutral-800">
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
