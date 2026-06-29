"use client"

export function SummaryField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="bg-muted/15 p-4 rounded-xl border border-border/50">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-sm text-foreground mt-1">{value || "—"}</dd>
    </div>
  )
}
