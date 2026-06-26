import { notFound } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/app/dashboard/_components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function fmt(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)
}

export default async function AdminBirthDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  requireAdmin(session)

  const { id } = await params
  const birth = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      hospital: true,
      cityHall: true,
      doctor: true,
      secretaire: true,
      maire: true,
    },
  })
  if (!birth) notFound()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            {`${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim() || "Dossier"}
          </h1>
          <p className="text-xs text-muted-foreground">ID : {birth.id}</p>
        </div>
        <StatusBadge status={birth.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">Enfant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 text-xs">
            <p><span className="text-muted-foreground">Sexe :</span> {birth.babyGender ?? "—"}</p>
            <p><span className="text-muted-foreground">Naissance :</span> {fmt(birth.birthDate)}</p>
            <p><span className="text-muted-foreground">Lieu :</span> {birth.birthPlace ?? "—"}</p>
            <p><span className="text-muted-foreground">N° acte :</span> {birth.certificateNumber ?? "—"}</p>
            <p><span className="text-muted-foreground">Code citoyen :</span> {birth.citizenAccessId ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">Établissements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 text-xs">
            <p><span className="text-muted-foreground">Hôpital :</span> {birth.hospital.name}</p>
            <p><span className="text-muted-foreground">Mairie :</span> {birth.cityHall?.name ?? "—"}</p>
            <p><span className="text-muted-foreground">Médecin :</span> Dr. {birth.doctor.firstName} {birth.doctor.lastName}</p>
            <p><span className="text-muted-foreground">Secrétaire :</span> {birth.secretaire ? `${birth.secretaire.firstName} ${birth.secretaire.lastName}` : "—"}</p>
            <p><span className="text-muted-foreground">Maire :</span> {birth.maire ? `${birth.maire.firstName} ${birth.maire.lastName}` : "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">Mère</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 text-xs">
            <p>{birth.motherFirstName} {birth.motherLastName}</p>
            <p className="text-muted-foreground">CNI : {birth.motherCni ?? "—"}</p>
            <p className="text-muted-foreground">Profession : {birth.motherProfession ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium">Père</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 text-xs">
            <p>{birth.fatherFirstName ?? "—"} {birth.fatherLastName ?? ""}</p>
            <p className="text-muted-foreground">CNI : {birth.fatherCni ?? "—"}</p>
            <p className="text-muted-foreground">Profession : {birth.fatherProfession ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      {birth.status === "APPROVED" && birth.certificateNumber && (
        <a
          href={`/api/certificate/${birth.id}`}
          className="inline-block text-sm text-primary hover:underline"
        >
          Télécharger le PDF officiel
        </a>
      )}

      <Link href="/dashboard/admin/births" className="block text-xs text-muted-foreground hover:underline">
        ← Retour à la liste
      </Link>
    </div>
  )
}
