import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  if (session.role === "DOCTOR") redirect("/dashboard/hospital")
  if (session.role === "SECRETAIRE") redirect("/dashboard/city-hall")
  if (session.role === "MAIRE") redirect("/dashboard/maire")
  if (session.role === "MAINTAINER") redirect("/dashboard/city-hall")

  // ADMIN
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Administration</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Connecté en tant que <strong>{session.username}</strong> (ADMIN)
      </p>
    </div>
  )
}
