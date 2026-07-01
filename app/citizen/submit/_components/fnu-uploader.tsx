"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { FileUpload, FileUploadItem } from "@/components/motion/file-upload"

interface FnuUploaderProps {
  value: FileUploadItem[]
  onValueChange: (items: FileUploadItem[]) => void
}

export function FnuUploader({ value, onValueChange }: FnuUploaderProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
        6. Formulaire FNU papier / Scanned FNU Sheet
      </h3>
      <div className="space-y-1.5">
        <Label className="text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
          Fichier scanné du FNU papier officiel / Scanned Document
        </Label>
        <FileUpload
          value={value}
          onValueChange={onValueChange}
          title="Glissez-déposez le formulaire FNU scanné"
          description="Formats acceptés : PDF, PNG ou JPG (Max. 5 Mo)"
          browseLabel="Parcourir"
          maxFiles={1}
        />
      </div>
    </div>
  )
}
