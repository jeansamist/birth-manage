import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApproveDeclinePanel } from "./_components/approve-decline-panel"

function fmt(date: Date | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", opts ?? { dateStyle: "long" }).format(new Date(date))
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium text-xs mt-0.5">{value || "—"}</dd>
    </div>
  )
}

export default async function MaireReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || session.role !== "MAIRE") redirect("/dashboard")

  const birth = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      hospital: true,
      doctor: { select: { firstName: true, lastName: true } },
      secretaire: { select: { firstName: true, lastName: true } },
      cityHall: { select: { name: true } },
    },
  })

  if (!birth || birth.status !== "PENDING_APPROVAL" || birth.cityHallId !== session.institutionId) {
    notFound()
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Examen du dossier</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {birth.hospital.name} · {birth.cityHall?.name}
        </p>
      </div>

      {/* Baby */}
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Enfant</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Row label="Prénom" value={birth.babyFirstName} />
          <Row label="Nom" value={birth.babyLastName} />
          <Row label="Sexe" value={birth.babyGender === "MALE" ? "Masculin" : birth.babyGender === "FEMALE" ? "Féminin" : undefined} />
          <Row label="Date de naissance" value={fmt(birth.birthDate)} />
          <Row label="Heure" value={birth.birthTime ?? undefined} />
          <Row label="Lieu" value={birth.birthPlace ?? undefined} />
        </dl>
      </section>

      {/* Medical */}
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Données médicales</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Row label="Poids" value={birth.weightGrams ? `${birth.weightGrams} g` : undefined} />
          <Row label="Taille" value={birth.heightCm ? `${birth.heightCm} cm` : undefined} />
          <Row label="Apgar" value={birth.apgarScore?.toString()} />
          <Row label="Accouchement" value={birth.deliveryType ?? undefined} />
          <Row label="Médecin" value={`Dr. ${birth.doctor.firstName} ${birth.doctor.lastName}`} />
          <Row label="Hôpital" value={birth.hospital.name} />
        </dl>
        {birth.medicalNotes && (
          <div className="mt-3">
            <dt className="text-muted-foreground text-xs">Notes médicales</dt>
            <dd className="text-xs mt-0.5 whitespace-pre-line">{birth.medicalNotes}</dd>
          </div>
        )}
      </section>

      {/* Mother */}
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Mère</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Row label="Prénom" value={birth.motherFirstName} />
          <Row label="Nom" value={birth.motherLastName} />
          <Row label="Date naissance" value={fmt(birth.motherBirthDate)} />
          <Row label="Nationalité" value={birth.motherNationality ?? undefined} />
          <Row label="CNI" value={birth.motherCni ?? undefined} />
          <Row label="Profession" value={birth.motherProfession ?? undefined} />
          <Row label="Adresse" value={birth.motherAddress ?? undefined} />
          <Row label="Téléphone" value={birth.motherPhone ?? undefined} />
        </dl>
      </section>

      {/* Father */}
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Père</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Row label="Prénom" value={birth.fatherFirstName ?? undefined} />
          <Row label="Nom" value={birth.fatherLastName ?? undefined} />
          <Row label="Date naissance" value={fmt(birth.fatherBirthDate)} />
          <Row label="Nationalité" value={birth.fatherNationality ?? undefined} />
          <Row label="CNI" value={birth.fatherCni ?? undefined} />
          <Row label="Profession" value={birth.fatherProfession ?? undefined} />
          <Row label="Adresse" value={birth.fatherAddress ?? undefined} />
          <Row label="Téléphone" value={birth.fatherPhone ?? undefined} />
        </dl>
      </section>

      {/* Marriage */}
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Mariage</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3">
          <Row label="Mariés" value={birth.parentsMarried ? "Oui" : "Non"} />
          {birth.parentsMarried && (
            <>
              <Row label="N° acte" value={birth.marriageCertNumber ?? undefined} />
              <Row label="Date mariage" value={fmt(birth.marriageDate)} />
            </>
          )}
        </dl>
      </section>

      {/* Action panel */}
      <ApproveDeclinePanel birthId={birth.id} />
    </div>
  )
}
