"use client"

import { Building2Icon, LandmarkIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AvailabilityListProps {
  birth: {
    cityHall: {
      name: string
      city: string
      address: string | null
    } | null
    copies: Array<{
      id: string
      cityHall: {
        name: string
        city: string
        address: string | null
      }
    }>
  }
}

export function AvailabilityList({ birth }: AvailabilityListProps) {
  return (
    <Card className="rounded-3xl border border-border overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-5">
        <CardTitle className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LandmarkIcon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Mairies dépositaires de l&apos;acte</p>
            <p className="text-xs font-normal text-muted-foreground">Où récupérer une copie certifiée</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {birth.cityHall && (
          <AvailabilityRow
            title={birth.cityHall.name}
            subtitle={`${birth.cityHall.city}${birth.cityHall.address ? ` · ${birth.cityHall.address}` : ""}`}
            badge="Original"
            isOriginal
          />
        )}
        {birth.copies.map((copy) => (
          <AvailabilityRow
            key={copy.id}
            title={copy.cityHall.name}
            subtitle={`${copy.cityHall.city}${copy.cityHall.address ? ` · ${copy.cityHall.address}` : ""}`}
            badge="Copie certifiée"
            isOriginal={false}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function AvailabilityRow({
  title,
  subtitle,
  badge,
  isOriginal,
}: {
  title: string
  subtitle: string
  badge: string
  isOriginal: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-muted/15 p-4 transition-colors hover:bg-muted/25">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
          <Building2Icon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{title}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Badge
        className={
          isOriginal
            ? "shrink-0 rounded-full bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground"
            : "shrink-0 rounded-full border-primary/30 bg-primary/5 px-2.5 py-0.5 font-semibold text-primary"
        }
        variant={isOriginal ? "default" : "outline"}
      >
        {badge}
      </Badge>
    </div>
  )
}
