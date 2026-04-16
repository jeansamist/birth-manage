import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BirthForm } from "./_components/birth-form"

export default async function NewBirthPage() {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  const cityHalls = await prisma.cityHall.findMany({
    where: { isActive: true },
    select: { id: true, name: true, city: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Nouvelle déclaration de naissance</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Remplissez les informations en 4 étapes.
        </p>
      </div>
      <BirthForm cityHalls={cityHalls} />
    </div>
  )
}
