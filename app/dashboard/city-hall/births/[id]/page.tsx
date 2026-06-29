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
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[900px] bg-card border border-border rounded-[24px] shadow-xl p-8 md:p-10 space-y-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            🏛️ Agent d'État Civil
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-1 text-foreground">Compléter le dossier</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {birth.hospital.name} · Dr. {birth.doctor.firstName} {birth.doctor.lastName}
          </p>
        </div>

        {/* Read-only summary from hospital */}
        <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Informations reçues de l'hôpital
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
            <div>
              <dt className="text-muted-foreground">Enfant</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">{birth.babyFirstName} {birth.babyLastName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sexe</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">{birth.babyGender === "MALE" ? "Masculin" : "Féminin"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Date de naissance</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">{fmt(birth.birthDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Heure de naissance</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">{birth.birthTime ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Mère</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">{birth.motherFirstName} {birth.motherLastName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Père</dt>
              <dd className="font-semibold text-foreground text-sm mt-0.5">
                {birth.fatherFirstName ? `${birth.fatherFirstName} ${birth.fatherLastName}` : "Non déclaré (Père inconnu)"}
              </dd>
            </div>
          </dl>
        </div>

        <CompletionForm birth={birth} />
      </div>
    </div>
  )
}
