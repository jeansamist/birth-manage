import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { updateCityHall } from "@/app/actions/admin"
import { InstitutionForm } from "../../_components/institution-form"

export default async function EditCityHallPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  requireAdmin(session)

  const { id } = await params
  const cityHall = await prisma.cityHall.findUnique({ where: { id } })
  if (!cityHall) notFound()

  const updateAction = async (formData: FormData) => {
    "use server"
    await updateCityHall(id, formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Modifier — {cityHall.name}</h1>
      <InstitutionForm
        action={updateAction}
        defaultValues={cityHall}
        submitLabel="Enregistrer"
        cancelHref="/dashboard/admin/city-halls"
      />
    </div>
  )
}
