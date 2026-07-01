import { redirect } from "next/navigation"
import { clearSession } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST() {
  await clearSession()
  redirect("/auth/login")
}
