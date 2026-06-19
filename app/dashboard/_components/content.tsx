"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  FileOutputIcon,
  XIcon,
  Baby,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
  SendIcon,
  AlertCircleIcon,
  ArrowRightLeftIcon,
  FileTextIcon,
  BarChart2Icon,
  FileIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/store/dashboard-store"
import { cn } from "@/lib/utils"

// ─── Icon registry — seules des strings traversent la frontière Server→Client ─

export type StatIconKey =
  | "baby"
  | "clock"
  | "check"
  | "x"
  | "inbox"
  | "send"
  | "alert"
  | "transfer"
  | "file"
  | "bar"
  | "filetext"

const ICON_MAP: Record<StatIconKey, React.ElementType> = {
  baby: Baby,
  clock: ClockIcon,
  check: CheckCircleIcon,
  x: XCircleIcon,
  inbox: InboxIcon,
  send: SendIcon,
  alert: AlertCircleIcon,
  transfer: ArrowRightLeftIcon,
  file: FileIcon,
  bar: BarChart2Icon,
  filetext: FileTextIcon,
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StatCard {
  title: string
  value: string
  subtitle: string
  icon: StatIconKey
  subtitleIcon: StatIconKey
}

interface DashboardContentProps {
  alertMessage?: string | null
  statsCards?: StatCard[]
  table?: React.ReactNode
  children?: React.ReactNode
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardContent({
  alertMessage,
  statsCards,
  table,
  children,
}: DashboardContentProps) {
  const layoutDensity = useDashboardStore((s) => s.layoutDensity)
  const showAlertBanner = useDashboardStore((s) => s.showAlertBanner)
  const showStatsCards = useDashboardStore((s) => s.showStatsCards)
  const showTable = useDashboardStore((s) => s.showTable)

  const [bannerDismissed, setBannerDismissed] = React.useState(false)

  return (
    <div
      className={cn(
        "w-full flex-1",
        layoutDensity === "compact" && "p-3 sm:p-4 space-y-4",
        layoutDensity === "default" && "p-4 sm:p-6 space-y-6",
        layoutDensity === "comfortable" && "p-6 sm:p-8 space-y-8"
      )}
    >
      {/* ── Alert Banner ───────────────────────────────────────────── */}
      {showAlertBanner && alertMessage && !bannerDismissed && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-start sm:items-center gap-4">
            <span className="text-3xl select-none">🗒️</span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {alertMessage}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <FileOutputIcon className="size-4" />
              Exporter
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              Agir
              <span className="h-4 w-px bg-background/20" />
              <ChevronDownIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              onClick={() => setBannerDismissed(true)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Stats Cards ─────────────────────────────────────────────── */}
      {showStatsCards && statsCards && statsCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const Icon = ICON_MAP[stat.icon]
            const SubIcon = ICON_MAP[stat.subtitleIcon]
            return (
              <div
                key={stat.title}
                className="relative p-5 rounded-xl border border-border bg-card overflow-hidden shadow-sm"
              >
                <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent pointer-events-none dark:from-white/5" />
                <div className="relative flex items-start justify-between">
                  <div className="flex flex-col gap-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <SubIcon className="size-3.5" />
                      <span className="text-xs font-medium">{stat.subtitle}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="size-10 shrink-0">
                    <Icon className="size-5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Table / Children ────────────────────────────────────────── */}
      {showTable && (table || children) && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {table ?? children}
        </div>
      )}
    </div>
  )
}
