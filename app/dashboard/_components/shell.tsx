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
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar session={session} />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-xl overflow-hidden flex flex-col items-center justify-start h-full w-full bg-background shadow-sm">
          <DashboardHeader />
          <main className="flex-1 w-full overflow-y-auto bg-muted/20">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
