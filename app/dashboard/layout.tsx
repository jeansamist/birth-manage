import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./_components/sidebar"
import { DashboardHeader } from "./_components/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/auth/login")

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

