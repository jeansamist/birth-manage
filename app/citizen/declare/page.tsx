import * as React from "react"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DeclareForm } from "./_components/declare-form"

interface DeclarePageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function DeclarePage({ searchParams }: DeclarePageProps) {
  const search = await searchParams
  const code = search.code?.trim().toUpperCase() ?? ""

  if (!code) {
    redirect("/citizen/track?error=missing-code")
  }

  const birth = await prisma.birthRecord.findFirst({
    where: {
      OR: [
        { citizenTrackingCode: code },
        { citizenAccessId: code },
      ],
    },
    include: {
      hospital: { select: { id: true, name: true, city: true } },
      cityHall: { select: { id: true, name: true, city: true } },
    },
  })

  if (!birth) {
    redirect("/citizen/track?error=not-found")
  }

  if (birth.status !== "DRAFT") {
    redirect(`/citizen/track?code=${code}&error=already-finalized`)
  }

  return (
    <div className="w-full h-[calc(100vh-7rem)] min-h-0">
      <DeclareForm birth={birth} />
    </div>
  )
}
