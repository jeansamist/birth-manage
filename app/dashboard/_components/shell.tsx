"use client"

import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { SessionPayload } from "@/types/auth"

// ssr: false → évite le mismatch d'IDs Radix UI entre serveur et client
const DashboardSidebar = dynamic(
  () => import("./sidebar").then((m) => ({ default: m.DashboardSidebar })),
  { ssr: false }
)

const DashboardHeader = dynamic(
  () => import("./header").then((m) => ({ default: m.DashboardHeader })),
  { ssr: false }
)

interface DashboardShellProps {
  session: SessionPayload
  children: React.ReactNode
}

export function DashboardShell({ session, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar session={session} />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
