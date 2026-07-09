"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EraserIcon, PenLineIcon } from "lucide-react"

interface SignaturePadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  savedSignature: string | null
  isPending: boolean
  /** dataUrl = nouvelle signature dessinée ; null = réutiliser la signature enregistrée */
  onConfirm: (dataUrl: string | null) => void
}

export function SignaturePadDialog({
  open,
  onOpenChange,
  savedSignature,
  isPending,
  onConfirm,
}: SignaturePadDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [redrawing, setRedrawing] = useState(false)

  const showPad = !savedSignature || redrawing

  function handleOpenChange(next: boolean) {
    if (!next) {
      setRedrawing(false)
      setHasDrawn(false)
    }
    onOpenChange(next)
  }

  useEffect(() => {
    if (!open || !showPad) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Dimensionne le buffer sur la taille layout réelle (offsetWidth ignore les
    // transforms de l'animation du dialog) en résolution ≥ 2x pour un trait net.
    function configure() {
      if (!canvas) return
      const ratio = Math.max(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.offsetWidth * ratio)
      const h = Math.round(canvas.offsetHeight * ratio)
      if (!w || !h || (canvas.width === w && canvas.height === h)) return
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.scale(ratio, ratio)
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = "#1e3a8a"
    }

    configure()
    const observer = new ResizeObserver(configure)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [open, showPad])

  // Coordonnées en espace layout du canvas, corrigées d'un éventuel transform
  // (le dialog s'ouvre avec une animation de scale)
  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.offsetWidth / rect.width),
      y: (e.clientY - rect.top) * (canvas.offsetHeight / rect.height),
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // pointer capture indisponible (événement synthétique) — le dessin fonctionne sans
    }
    drawingRef.current = true
    const { x, y } = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const { x, y } = getPoint(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasDrawn(true)
  }

  function onPointerUp() {
    drawingRef.current = false
  }

  function clearPad() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  function confirm() {
    if (showPad) {
      const canvas = canvasRef.current
      if (!canvas || !hasDrawn) return
      onConfirm(canvas.toDataURL("image/png"))
    } else {
      onConfirm(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider text-sm">
            Signature de l&apos;Officier d&apos;État Civil
          </DialogTitle>
          <DialogDescription className="text-xs">
            {showPad
              ? "Dessinez votre signature ci-dessous. Elle sera apposée sur l’acte de naissance et enregistrée pour vos prochaines signatures."
              : "Votre signature enregistrée sera apposée sur l’acte de naissance."}
          </DialogDescription>
        </DialogHeader>

        {showPad ? (
          <div className="space-y-2">
            <canvas
              ref={canvasRef}
              style={{ touchAction: "none" }}
              className="block w-full h-[180px] rounded-md border border-dashed border-neutral-300 bg-neutral-50 cursor-crosshair"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground italic">
                Signez à la souris ou au doigt sur écran tactile.
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={clearPad}
                disabled={!hasDrawn || isPending}
              >
                <EraserIcon className="size-3.5" />
                Effacer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-md border border-neutral-200 bg-neutral-50 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={savedSignature!} alt="Signature enregistrée" className="max-h-28 object-contain" />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => setRedrawing(true)}
              disabled={isPending}
            >
              <PenLineIcon className="size-3.5" />
              Redessiner ma signature
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs font-semibold uppercase tracking-wider"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            className="h-9 px-5 text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-900 text-white"
            onClick={confirm}
            disabled={isPending || (showPad && !hasDrawn)}
          >
            {isPending ? "Signature…" : "Approuver et signer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
