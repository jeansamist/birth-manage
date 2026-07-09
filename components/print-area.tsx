"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

/**
 * Portail direct vers document.body pour l'impression. Évite que le
 * contenu à imprimer hérite d'un ancêtre avec overflow-hidden/auto ou
 * hauteur contrainte (sidebar, shell dashboard, layout citoyen...), ce
 * qui empêchait `position: fixed` de s'étendre correctement sur la page
 * imprimée et produisait un aperçu vide.
 */
export function PrintArea({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = document.createElement("div")
    el.id = "print-area"
    document.body.appendChild(el)
    setContainer(el)
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  if (!container) return null
  return createPortal(children, container)
}
