import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  if (session.role === "DOCTOR") redirect("/dashboard/hospital")
  if (session.role === "SECRETAIRE") redirect("/dashboard/city-hall")
  if (session.role === "MAIRE") redirect("/dashboard/maire")
  if (session.role === "MAINTAINER") redirect("/dashboard/city-hall")
  if (session.role === "ADMIN") redirect("/dashboard/admin")

  redirect("/auth/login")
}
