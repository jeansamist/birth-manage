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
import { EraserIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
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

    function configure() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.max(window.devicePixelRatio || 1, 3)
      const w = Math.round(rect.width * ratio)
      const h = Math.round(rect.height * ratio)
      if (!w || !h || (canvas.width === w && canvas.height === h)) return
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.lineWidth = 2.8 * ratio
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = "#1e3a8a"
      ctx.imageSmoothingEnabled = true
    }

    configure()
    const observer = new ResizeObserver(configure)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [open, showPad])

  // Coordonnées dans le buffer réel du canvas. Cela garde la pointe du trait
  // sous le pointeur même sur écrans haute densité et pendant l'animation du dialog.
  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function getConfiguredContext() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return null
    const ratio = canvas.width / canvas.getBoundingClientRect().width
    ctx.lineWidth = 2.8 * ratio
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#1e3a8a"
    return ctx
  }

  function drawTo(point: { x: number; y: number }) {
    const ctx = getConfiguredContext()
    const lastPoint = lastPointRef.current
    if (!ctx || !lastPoint) return

    const midPoint = {
      x: (lastPoint.x + point.x) / 2,
      y: (lastPoint.y + point.y) / 2,
    }

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y)
    ctx.stroke()
    lastPointRef.current = point
    setHasDrawn(true)
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = getConfiguredContext()
    if (!ctx) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // pointer capture indisponible (événement synthétique) — le dessin fonctionne sans
    }
    drawingRef.current = true
    const { x, y } = getPoint(e)
    lastPointRef.current = { x, y }
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    drawTo(getPoint(e))
  }

  function onPointerUp() {
    drawingRef.current = false
    lastPointRef.current = null
  }

  function clearPad() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastPointRef.current = null
    setHasDrawn(false)
  }

  function exportSignature() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return null

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { data, width, height } = imageData
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const alpha = data[(y * width + x) * 4 + 3]
        if (alpha > 8) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }

    if (minX > maxX || minY > maxY) return null

    const ratio = canvas.width / canvas.getBoundingClientRect().width
    const padding = Math.round(16 * ratio)
    const sx = Math.max(0, minX - padding)
    const sy = Math.max(0, minY - padding)
    const sw = Math.min(width - sx, maxX - minX + padding * 2)
    const sh = Math.min(height - sy, maxY - minY + padding * 2)
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = sw
    exportCanvas.height = sh
    const exportCtx = exportCanvas.getContext("2d")
    if (!exportCtx) return null
    exportCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh)
    return exportCanvas.toDataURL("image/png")
  }

  function confirm() {
    if (showPad) {
      if (!hasDrawn) return
      const dataUrl = exportSignature()
      if (!dataUrl) return
      onConfirm(dataUrl)
    } else {
      onConfirm(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle className="text-sm tracking-wider uppercase">
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
              className="block h-[180px] w-full cursor-crosshair rounded-md border border-dashed border-neutral-300 bg-neutral-50"
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
                className="h-7 gap-1.5 text-xs"
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
            <div className="flex items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={savedSignature!}
                alt="Signature enregistrée"
                className="max-h-28 object-contain"
              />
            </div>
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => setRedrawing(true)}
              disabled={isPending}
            >
              <PenLineIcon className="size-3.5" />
              Redessiner ma signature
            </Button> */}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs font-semibold tracking-wider uppercase"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            className="h-9 bg-neutral-800 px-5 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-900"
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
