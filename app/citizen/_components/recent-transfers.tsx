"use client"

import { ArrowRightLeftIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

interface TransferRequest {
  id: string
  status: string
  createdAt: Date
  targetCityHall: {
    name: string
    city: string
  }
}

interface RecentTransfersProps {
  transferRequests: TransferRequest[]
}

export function RecentTransfers({ transferRequests }: RecentTransfersProps) {
  return (
    <Card className="rounded-3xl border border-border overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-5">
        <CardTitle className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ArrowRightLeftIcon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Demandes de transfert récentes</p>
            <p className="text-xs font-normal text-muted-foreground">Suivi de vos requêtes envoyées</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {transferRequests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-6 text-center text-xs text-muted-foreground italic">
            Aucune demande de transfert effectuée pour le moment.
          </p>
        ) : (
          transferRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-muted/15 p-4"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-bold text-foreground">
                  {request.targetCityHall.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {request.targetCityHall.city} · Demande du {formatDate(request.createdAt)}
                </span>
              </div>
              <TransferBadge status={request.status} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function TransferBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <Badge className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-emerald-600">
        Approuvée
      </Badge>
    )
  }
  if (status === "DECLINED") {
    return (
      <Badge className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" variant="destructive">
        Refusée
      </Badge>
    )
  }
  return (
    <Badge className="shrink-0 rounded-full border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600" variant="outline">
      En attente
    </Badge>
  )
}
