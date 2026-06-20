import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BabySummary } from "./_components/baby-summary"
import { MedicalSummary } from "./_components/medical-summary"
import { MotherSummary } from "./_components/mother-summary"
import { FatherSummary } from "./_components/father-summary"
import { MarriageSummary } from "./_components/marriage-summary"
import { ApproveDeclinePanel } from "./_components/approve-decline-panel"

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
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[900px] bg-card border border-border rounded-[24px] shadow-xl p-8 md:p-10 space-y-8">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            🏛️ Officier d'État Civil / Maire
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-1 text-foreground">Examen et signature du dossier</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {birth.hospital.name} · {birth.cityHall?.name}
          </p>
        </div>

        <div className="space-y-6">
          <BabySummary birth={birth} />
          <MedicalSummary birth={birth} />
          <MotherSummary birth={birth} />
          <FatherSummary birth={birth} />
          <MarriageSummary birth={birth} />
        </div>

        <ApproveDeclinePanel birthId={birth.id} />
      </div>
    </div>
  )
}
