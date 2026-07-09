import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeftIcon, ArrowRightLeftIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { approveTransferRequest, declineTransferRequest } from "@/app/actions/birth"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

function formatDate(date: Date | null | undefined) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  )
}

export default async function TransferReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session || session.role !== "MAIRE" || !session.institutionId) redirect("/dashboard")

  const request = await prisma.transferRequest.findUnique({
    where: { id },
    include: {
      sourceCityHall: { select: { name: true, city: true, address: true } },
      targetCityHall: { select: { name: true, city: true, address: true } },
      birthRecord: {
        include: {
          hospital: { select: { name: true, city: true } },
          maire: { select: { firstName: true, lastName: true } },
        },
      },
    },
  })

  if (!request || request.sourceCityHallId !== session.institutionId) {
    redirect("/dashboard/maire?section=transfers")
  }

  const birth = request.birthRecord
  const childName = `${birth.babyFirstName ?? ""} ${birth.babyLastName ?? ""}`.trim()
  const maireName = birth.maire ? `${birth.maire.firstName} ${birth.maire.lastName}` : null

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/maire?section=transfers">
            <ArrowLeftIcon className="size-4" />
            Retour aux transferts
          </Link>
        </Button>
        <span className="inline-flex items-center rounded-md border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {request.status === "PENDING" ? "En attente d'examen" : request.status}
        </span>
      </div>

      <section className="rounded-xl border bg-card">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <ArrowRightLeftIcon className="size-5 text-muted-foreground" />
          <div>
            <h1 className="text-lg font-semibold">Examen de la demande de transfert</h1>
            <p className="text-xs text-muted-foreground">
              Vérifiez les informations avant d'autoriser la copie de l'acte vers la mairie cible.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded-lg border bg-background p-4 sm:grid-cols-2">
              <DetailItem label="Enfant" value={childName} />
              <DetailItem label="N° acte" value={birth.certificateNumber ?? birth.citizenAccessId} />
              <DetailItem label="Date de naissance" value={formatDate(birth.birthDate)} />
              <DetailItem label="Lieu de naissance" value={birth.birthPlace} />
              <DetailItem label="Hôpital" value={birth.hospital ? `${birth.hospital.name} · ${birth.hospital.city}` : null} />
              <DetailItem label="Signé par" value={maireName} />
            </div>

            <div className="grid gap-4 rounded-lg border bg-background p-4 sm:grid-cols-2">
              <DetailItem label="Mairie source" value={`${request.sourceCityHall.name} · ${request.sourceCityHall.city}`} />
              <DetailItem label="Mairie cible" value={`${request.targetCityHall.name} · ${request.targetCityHall.city}`} />
              <DetailItem label="Adresse source" value={request.sourceCityHall.address} />
              <DetailItem label="Adresse cible" value={request.targetCityHall.address} />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border bg-background p-4">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Demandeur</h2>
              <div className="space-y-4">
                <DetailItem label="Nom" value={request.requesterName} />
                <DetailItem label="Téléphone" value={request.requesterPhone} />
                <DetailItem label="Demande reçue le" value={formatDate(request.createdAt)} />
                <DetailItem label="Motif" value={request.reason} />
              </div>
            </div>

            {request.status === "PENDING" ? (
              <div className="rounded-lg border bg-background p-4">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Décision du maire</h2>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <form action={approveTransferRequest.bind(null, request.id)} className="flex-1">
                    <Button type="submit" className="w-full">
                      <CheckCircleIcon className="size-4" />
                      Autoriser le transfert
                    </Button>
                  </form>
                  <form action={declineTransferRequest.bind(null, request.id)} className="flex-1">
                    <Button type="submit" variant="outline" className="w-full">
                      <XCircleIcon className="size-4" />
                      Refuser la demande
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
                Cette demande a déjà été traitée le {formatDate(request.decidedAt)}.
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}
