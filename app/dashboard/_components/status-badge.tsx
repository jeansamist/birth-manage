import { Badge } from "@/components/ui/badge"
import type { BirthStatus } from "@/types/birth"

const STATUS_CONFIG: Record<BirthStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Brouillon",
    className: "",
  },
  SUBMITTED: {
    label: "Soumis",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  PROCESSING: {
    label: "En traitement",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  PENDING_APPROVAL: {
    label: "En attente signature",
    className:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  APPROVED: {
    label: "Approuvé",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  DECLINED: {
    label: "Refusé",
    className:
      "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
}

export function StatusBadge({ status }: { status: BirthStatus }) {
  const { label, className } = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT
  return (
    <Badge variant="outline" className={`rounded-full text-[10px] font-semibold ${className}`}>
      {label}
    </Badge>
  )
}
