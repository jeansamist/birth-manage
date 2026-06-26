import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { updateHospital } from "@/app/actions/admin"
import { InstitutionForm } from "../../_components/institution-form"

export default async function EditHospitalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  requireAdmin(session)

  const { id } = await params
  const hospital = await prisma.hospital.findUnique({ where: { id } })
  if (!hospital) notFound()

  const updateAction = async (formData: FormData) => {
    "use server"
    await updateHospital(id, formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Modifier — {hospital.name}</h1>
      <InstitutionForm
        action={updateAction}
        defaultValues={hospital}
        submitLabel="Enregistrer"
        cancelHref="/dashboard/admin/hospitals"
      />
    </div>
  )
}
