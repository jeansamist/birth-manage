"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

interface CredentialsRevealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string | null
  password: string | null
}

export function CredentialsRevealDialog({
  open,
  onOpenChange,
  username,
  password,
}: CredentialsRevealDialogProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  function handleCopy() {
    if (!username || !password) return
    navigator.clipboard.writeText(`${password}`)
    setCopied(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Identifiants générés</DialogTitle>
          <DialogDescription>
            Ce mot de passe ne sera plus affiché. Transmettez-le à
            l'intéressé(e) avant de fermer cette fenêtre.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 rounded-xl border bg-muted/40 p-3 font-mono text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Identifiant</span>
            <span className="font-semibold">{username}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Mot de passe</span>
            <span className="font-semibold">{password}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {copied ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
            {copied ? "Copié" : "Copier le mot de passe"}
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
