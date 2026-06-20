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
    <Card className="rounded-2xl border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <LandmarkIcon className="size-5 text-primary" /> Mairies dépositaires de l'acte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
            badge="Copie Certifiée"
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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/15 transition-colors p-4">
      <div className="flex items-center gap-3 min-w-0">
        <Building2Icon className="size-5 text-muted-foreground/80 shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
        </div>
      </div>
      <Badge
        className={
          isOriginal
            ? "bg-primary text-primary-foreground font-semibold px-2.5 py-0.5 rounded-full shrink-0"
            : "border-primary/30 text-primary bg-primary/5 font-semibold px-2.5 py-0.5 rounded-full shrink-0"
        }
        variant={isOriginal ? "default" : "outline"}
      >
        {badge}
      </Badge>
    </div>
  )
}
