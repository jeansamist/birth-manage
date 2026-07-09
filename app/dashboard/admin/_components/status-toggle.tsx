"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { setEntityActive } from "@/app/actions/admin"

interface StatusToggleProps {
  entity: "cityHall" | "hospital" | "user"
  id: string
  isActive: boolean
}

export function StatusToggle({ entity, id, isActive }: StatusToggleProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [optimisticActive, setOptimisticActive] = React.useState(isActive)

  function handleChange(checked: boolean) {
    setOptimisticActive(checked)
    startTransition(async () => {
      await setEntityActive(entity, id, checked)
      router.refresh()
    })
  }

  return (
    <Switch
      checked={optimisticActive}
      disabled={isPending}
      onCheckedChange={handleChange}
      aria-label={optimisticActive ? "Désactiver" : "Activer"}
    />
  )
}
