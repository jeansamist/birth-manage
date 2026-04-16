"use client"

import { useTransition } from "react"
import { claimBirth } from "@/app/actions/birth"
import { Button } from "@/components/ui/button"

export function ClaimButton({ birthId }: { birthId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-6 text-xs"
      disabled={isPending}
      onClick={() => startTransition(() => claimBirth(birthId))}
    >
      {isPending ? "…" : "Prendre en charge"}
    </Button>
  )
}
