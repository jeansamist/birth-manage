import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CompletionForm } from "./_components/completion-form"

function fmt(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

export default async function BirthCompletionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role)) redirect("/dashboard")

  const birth = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      hospital: { select: { name: true, city: true } },
      doctor: { select: { firstName: true, lastName: true } },
      cityHall: { select: { name: true, city: true } },
    },
  })

  if (!birth || birth.status !== "PROCESSING" || birth.secretaireId !== session.userId) {
    notFound()
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-background w-full">
      <CompletionForm birth={birth} />
    </div>
  )
}
