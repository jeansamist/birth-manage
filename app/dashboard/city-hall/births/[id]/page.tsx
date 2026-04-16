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
    },
  })

  if (!birth || birth.status !== "PROCESSING" || birth.secretaireId !== session.userId) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold">Compléter le dossier</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {birth.hospital.name} · Dr. {birth.doctor.firstName} {birth.doctor.lastName}
        </p>
      </div>

      {/* Read-only summary from hospital */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Informations de l'hôpital
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Enfant</dt>
            <dd className="font-medium">{birth.babyFirstName} {birth.babyLastName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sexe</dt>
            <dd className="font-medium">{birth.babyGender === "MALE" ? "Masculin" : "Féminin"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Date de naissance</dt>
            <dd className="font-medium">{fmt(birth.birthDate)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Heure</dt>
            <dd className="font-medium">{birth.birthTime ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Mère</dt>
            <dd className="font-medium">{birth.motherFirstName} {birth.motherLastName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Père</dt>
            <dd className="font-medium">
              {birth.fatherFirstName ? `${birth.fatherFirstName} ${birth.fatherLastName}` : "—"}
            </dd>
          </div>
        </dl>
      </div>

      <CompletionForm birth={birth} />
    </div>
  )
}
