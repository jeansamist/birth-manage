import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Marque une notification (ou toutes) comme lue pour l'utilisateur connecté.
// Body : { id: string } ou { all: true }

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))

  if (body?.all === true) {
    await prisma.notification.updateMany({
      where: { userId: session.userId, read: false },
      data: { read: true, readAt: new Date() },
    })
    return NextResponse.json({ success: true })
  }

  const id = typeof body?.id === "string" ? body.id : null
  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 })
  }

  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data: { read: true, readAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
