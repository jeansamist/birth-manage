import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardNav } from "./_components/nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav session={session} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
