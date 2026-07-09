"use client"

import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      size="sm"
      className="gap-2 h-9 text-xs font-bold uppercase tracking-wider cursor-pointer"
    >
      <PrinterIcon className="size-4" />
      Imprimer / Télécharger PDF
    </Button>
  )
}
