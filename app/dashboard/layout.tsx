import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardShell } from "./_components/shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  return <DashboardShell session={session}>{children}</DashboardShell>
}

