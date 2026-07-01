import * as React from "react"
import { Header } from "@/components/header"

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col font-sans antialiased text-neutral-800">
      {/* Top Floating Navbar */}
      <div className="w-full shrink-0 border-b border-neutral-100 bg-white py-2">
        <Header />
      </div>

      {/* Main content slot */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
