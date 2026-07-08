import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/app/dashboard/_components/content"
import { BirthsTable } from "./_components/births-table"
import { Button } from "@/components/ui/button"
import { PlusIcon, FileTextIcon } from "lucide-react"
import Link from "next/link"

export default async function HospitalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  // Charge uniquement les dossiers de statut DRAFT et DECLINED associés au médecin connecté
  const births = await prisma.birthRecord.findMany({
    where: {
      doctorId: session.userId,
      status: { in: ["DRAFT", "DECLINED"] },
    },
    orderBy: { updatedAt: "desc" },
    include: { cityHall: { select: { name: true } } },
  })

  const draftsCount = births.filter((b) => b.status === "DRAFT").length
  const declinedCount = births.filter((b) => b.status === "DECLINED").length

  const alertMessage =
    declinedCount > 0
      ? `Vous avez ${declinedCount} déclaration(s) rejetée(s) par la mairie. Veuillez effectuer les corrections demandées.`
      : draftsCount > 0
      ? `Vous avez ${draftsCount} déclaration(s) en cours de saisie (brouillon) — pensez à les finaliser.`
      : null

  return (
    <DashboardContent alertMessage={alertMessage}>
      <div className="space-y-6">
        {/* En-tête simplifié avec raccourci de création direct */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs text-left">
          <div className="space-y-1">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-800">
              Saisie et Enregistrement des Naissances
            </h2>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Déclarez officiellement les naissances survenues au sein de votre établissement hospitalier et transmettez-les au Bureau National de l'État Civil (BUNEC).
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#007A5E] hover:bg-[#00664f] active:scale-98 text-white flex items-center gap-2 px-6 rounded-md font-bold uppercase tracking-wider text-xs h-12 shadow-xs shrink-0 cursor-pointer transition-all duration-300">
            <Link href="/dashboard/hospital/births/new">
              <PlusIcon className="size-4.5" />
              Déclarer une naissance
            </Link>
          </Button>
        </div>

        {/* Section de suivi des brouillons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <FileTextIcon className="size-4 text-neutral-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Déclarations en attente d'action
            </h3>
          </div>
          <BirthsTable births={births as any} initialStatusFilter={filter} />
        </div>
      </div>
    </DashboardContent>
  )
}
