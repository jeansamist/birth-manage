import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getCityHallInboxCounts } from "@/lib/city-hall-inbox"
import { DashboardNav } from "./_components/nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  let inboxBadge = 0
  if (
    session.institutionId &&
    ["SECRETAIRE", "MAIRE", "MAINTAINER"].includes(session.role)
  ) {
    const counts = await getCityHallInboxCounts(session.institutionId)
    inboxBadge =
      session.role === "MAIRE"
        ? counts.submitted + counts.pendingApproval
        : counts.submitted
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav session={session} inboxBadge={inboxBadge} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
