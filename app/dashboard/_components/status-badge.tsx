import { Badge } from "@/components/ui/badge"
import type { BirthStatus, TransferRequestStatus } from "@/types/birth"

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  DRAFT: { label: "Brouillon", variant: "outline" },
  SUBMITTED: { label: "Soumis", variant: "secondary" },
  PROCESSING: { label: "En traitement", variant: "secondary" },
  PENDING_APPROVAL: { label: "En attente signature", variant: "secondary" },
  APPROVED: { label: "Approuvé", variant: "default" },
  DECLINED: { label: "Refusé", variant: "destructive" },
  PENDING: { label: "En attente", variant: "secondary" },
}

export function StatusBadge({ status }: { status: BirthStatus | TransferRequestStatus }) {
  const { label, variant } = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT
  return <Badge variant={variant}>{label}</Badge>
}
