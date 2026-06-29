"use client"

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
    <Card className="rounded-2xl border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Demandes de transfert récentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transferRequests.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Aucune demande de transfert effectuée pour le moment.</p>
        ) : (
          transferRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-border/60 bg-muted/10 p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <span className="font-semibold text-sm text-foreground truncate block">
                  {request.targetCityHall.name}
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
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
      <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-2.5 py-0.5 text-[10px]">
        Approuvée
      </Badge>
    )
  }
  if (status === "DECLINED") {
    return (
      <Badge className="bg-destructive text-destructive-foreground font-semibold rounded-full px-2.5 py-0.5 text-[10px]" variant="destructive">
        Refusée
      </Badge>
    )
  }
  return (
    <Badge className="border-amber-500/30 text-amber-600 bg-amber-500/5 font-semibold rounded-full px-2.5 py-0.5 text-[10px]" variant="outline">
      En attente
    </Badge>
  )
}
