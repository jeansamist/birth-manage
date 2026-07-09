"use client"

import { Button } from "@/components/ui/button"
import { PrinterIcon } from "lucide-react"

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      size="sm"
      className="h-9 cursor-pointer gap-2 text-xs font-bold tracking-wider uppercase"
    >
      <PrinterIcon className="size-4" />
      Imprimer
    </Button>
  )
}
