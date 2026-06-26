import { redirect } from "next/navigation"
import type { SessionPayload } from "@/types/auth"

export function requireAdmin(session: SessionPayload | null) {
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return session
}
